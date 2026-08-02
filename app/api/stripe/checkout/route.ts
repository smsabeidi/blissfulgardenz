import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl, getStripe, priceIdFor, PLAN_KEYS } from "@/lib/stripe";
import { env } from "@/lib/env";

// Node runtime: the Stripe SDK's default client and this project's Supabase
// server client both assume it.
export const runtime = "nodejs";

const BodySchema = z.object({
  plan: z.enum(PLAN_KEYS),
});

// Every message below is written to be shown to a person as-is. Plain, short,
// and it never blames them.
function fail(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

/**
 * The Stripe customer this person already has, if any.
 *
 * A member who cancels and rejoins should not become a second Stripe customer:
 * that splits their invoice history in two and makes the billing portal show
 * them half their own record. Read through the service role because a returning
 * member's seat is no longer active, which is exactly when the row-level policy
 * on `memberships` stops them reading it themselves.
 */
async function existingCustomerId(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("memberships")
    .select("stripe_customer_id")
    .eq("billing_owner_id", userId)
    .not("stripe_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const row = (data ?? null) as { stripe_customer_id: string | null } | null;
  return row?.stripe_customer_id ?? null;
}

export async function POST(request: Request) {
  const access = await getAccess();

  if (!access.signedIn || !access.userId) {
    return fail(401, "not_signed_in", "Please sign in before you join.");
  }

  // Guarding against a second subscription is worth a whole branch. A duplicate
  // charge on a membership like this one is not a billing annoyance, it is a
  // breach of trust with someone who already decided to trust us.
  if (access.isMember) {
    return fail(
      409,
      "already_a_member",
      "Your membership is already open. You can change your plan from your account."
    );
  }

  let plan: (typeof PLAN_KEYS)[number];
  try {
    const parsed = BodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return fail(400, "invalid_plan", "Please choose a plan and try again.");
    }
    plan = parsed.data.plan;
  } catch {
    return fail(400, "invalid_request", "Please choose a plan and try again.");
  }

  const stripe = getStripe();
  const priceId = priceIdFor(plan);

  if (!stripe || !priceId) {
    return fail(
      503,
      "billing_unavailable",
      "Joining is not open just yet. Please try again a little later."
    );
  }

  const supabase = await createClient();
  const authResult = supabase ? await supabase.auth.getUser() : null;
  const email = authResult?.data.user?.email ?? null;

  const customerId = await existingCustomerId(access.userId);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: absoluteUrl("/garden?welcome=1"),
    cancel_url: absoluteUrl("/membership"),
    client_reference_id: access.userId,
    allow_promotion_codes: true,
    // Off until STRIPE_AUTOMATIC_TAX=1. Stripe rejects the whole session when
    // automatic tax is on and the account has no head office address, so
    // hard-coding it true turned every join attempt into a 502.
    automatic_tax: { enabled: env.stripeAutomaticTax() },
    // Collected either way: it is what tax will be calculated from the moment
    // that flag is switched on, and it is useful on the receipt regardless.
    billing_address_collection: "required",
    metadata: { user_id: access.userId, plan },
    // This metadata is load-bearing, not decoration. Invoice and subscription
    // webhooks can arrive before `checkout.session.completed`, and when they do
    // this is the only thing on the object that says who paid.
    subscription_data: { metadata: { user_id: access.userId } },
  };

  if (customerId) {
    params.customer = customerId;
    // Required alongside `automatic_tax` when a customer is passed: it lets
    // Checkout write the address it collects back onto the customer.
    params.customer_update = { address: "auto", name: "auto" };
  } else if (email) {
    params.customer_email = email;
  }

  try {
    const session = await stripe.checkout.sessions.create(params);

    if (!session.url) {
      return fail(
        502,
        "checkout_unavailable",
        "We could not open the payment page. Please try again."
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe:checkout] could not create session", error);
    return fail(
      502,
      "checkout_failed",
      "We could not open the payment page. Please try again in a moment."
    );
  }
}
