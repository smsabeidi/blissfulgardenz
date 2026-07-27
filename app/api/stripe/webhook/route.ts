import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { provisionFromSubscription, type ProvisionResult } from "@/lib/billing/provision";

// Node, not edge, and this line is load-bearing. Signature verification needs
// the byte-exact request body and a real crypto implementation.
export const runtime = "nodejs";

const UNIQUE_VIOLATION = "23505";

type Outcome = {
  handled: boolean;
  note: string;
  result: ProvisionResult | null;
};

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/**
 * Stripe moved the subscription reference off the invoice and under `parent`.
 * Reading `invoice.subscription` would compile against nothing and quietly
 * return undefined, which would make every dunning event a no-op.
 */
function subscriptionIdOfInvoice(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent;
  if (!parent || parent.type !== "subscription_details") return null;
  return idOf(parent.subscription_details?.subscription);
}

/**
 * GUARDING OUT-OF-ORDER DELIVERY.
 *
 * Stripe makes no ordering promise. A `customer.subscription.updated` sent
 * before a `customer.subscription.deleted` can arrive after it, and writing the
 * event's own payload would then resurrect a cancelled membership. Re-reading
 * the subscription means every event writes the state as it is now, so the
 * order events happen to arrive in stops mattering.
 */
async function currentSubscription(
  stripe: Stripe,
  payload: Stripe.Subscription
): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.retrieve(payload.id);
  } catch (error) {
    // A slightly stale write beats no write. The next lifecycle event corrects it.
    console.warn(`[stripe:webhook] could not re-read subscription ${payload.id}`, error);
    return payload;
  }
}

async function handleEvent(stripe: Stripe, event: Stripe.Event): Promise<Outcome> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (session.mode !== "subscription") {
        return { handled: false, note: "checkout_not_a_subscription", result: null };
      }

      const subscriptionId = idOf(session.subscription);
      if (!subscriptionId) {
        return { handled: false, note: "checkout_without_subscription", result: null };
      }

      const userId =
        session.client_reference_id ??
        (typeof session.metadata?.user_id === "string" ? session.metadata.user_id : null);

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return {
        handled: true,
        note: "checkout_completed",
        result: await provisionFromSubscription(subscription, userId),
      };
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = await currentSubscription(stripe, event.data.object);
      return {
        handled: true,
        note: event.type,
        result: await provisionFromSubscription(subscription),
      };
    }

    case "invoice.payment_failed":
    case "invoice.payment_succeeded": {
      const subscriptionId = subscriptionIdOfInvoice(event.data.object);

      // One-off invoices are perfectly legitimate and have nothing to provision.
      if (!subscriptionId) {
        return { handled: false, note: "invoice_without_subscription", result: null };
      }

      // Provisioning from the subscription rather than from the invoice means a
      // failure moves the member to grace and a recovery restores them and
      // extends `valid_until`, both through the same single code path.
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return {
        handled: true,
        note: event.type,
        result: await provisionFromSubscription(subscription),
      };
    }

    default:
      // Stripe endpoints receive types nobody asked for, and a 500 here would
      // put the endpoint into Stripe's retry loop forever. Acknowledge and move on.
      return { handled: false, note: "type_not_handled", result: null };
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = env.stripeWebhookSecret();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    // 503 rather than 200 on purpose. Stripe retries a failed delivery for days,
    // so events that land before the keys are set replay once the deploy is
    // configured, instead of being acknowledged into the void.
    return NextResponse.json({ error: "billing_unconfigured" }, { status: 503 });
  }

  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  // RAW body. Parsing it first, or reading it after anything else has consumed
  // the stream, changes the bytes and the HMAC no longer matches.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (error) {
    // Forged, truncated, or outside the timestamp tolerance. Permanent for this
    // payload, so 400: a retry of the same bytes could never verify either.
    console.error("[stripe:webhook] signature verification failed", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    // Cannot deduplicate, therefore must not process. Let Stripe hold the event.
    return NextResponse.json({ error: "database_unconfigured" }, { status: 503 });
  }

  // GUARDING DUPLICATE DELIVERY.
  //
  // Stripe delivers at least once, and two instances can be handed the same
  // event concurrently. Claiming the event id first makes the primary key on
  // `stripe_events` the lock: exactly one writer proceeds, and application code
  // never has to be clever about it.
  const claim = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });

  if (claim.error) {
    if (claim.error.code === UNIQUE_VIOLATION) {
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }
    console.error("[stripe:webhook] could not record the event", claim.error);
    return NextResponse.json({ error: "claim_failed" }, { status: 500 });
  }

  try {
    const outcome = await handleEvent(stripe, event);
    const result = outcome.result;

    if (result && !result.ok) {
      if (result.reason === "unidentified_user") {
        // A retry of the identical payload cannot produce a user id, so holding
        // the claim and acknowledging is right. Logged at error level because
        // this is money arriving that nobody has been given access for.
        console.error(
          `[stripe:webhook] ${event.type} ${event.id} could not be attributed: ${result.message}`
        );
        return NextResponse.json(
          { received: true, handled: false, note: "unidentified_user" },
          { status: 200 }
        );
      }

      // Transient: a database write failed or the service role was missing.
      // Release the claim so Stripe's retry is not swallowed as a duplicate.
      // Without this line, claim-before-process would turn one bad minute into a
      // member who paid and never got in.
      await admin.from("stripe_events").delete().eq("id", event.id);
      console.error(
        `[stripe:webhook] ${event.type} ${event.id} failed (${result.reason}): ${result.message}`
      );
      return NextResponse.json({ error: result.reason }, { status: 500 });
    }

    if (result?.ok && result.warning === "seat_conflict") {
      console.warn(
        `[stripe:webhook] membership ${result.membershipId} provisioned without a seat: ` +
          `user ${result.userId} already holds an active seat elsewhere.`
      );
    }

    return NextResponse.json(
      { received: true, handled: outcome.handled, note: outcome.note },
      { status: 200 }
    );
  } catch (error) {
    // Same release, for anything thrown: a Stripe API read that timed out, a
    // network fault mid-provision. Stripe retries, and the retry gets a clean
    // claim to work with.
    await admin.from("stripe_events").delete().eq("id", event.id);
    console.error(`[stripe:webhook] ${event.type} ${event.id} threw`, error);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}
