import { NextResponse } from "next/server";
import { getAccess } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type MembershipBilling = {
  billing_owner_id: string | null;
  stripe_customer_id: string | null;
};

function fail(status: number, error: string, message: string) {
  return NextResponse.json({ error, message }, { status });
}

export async function POST() {
  const access = await getAccess();

  if (!access.signedIn || !access.userId) {
    return fail(401, "not_signed_in", "Please sign in to manage your membership.");
  }

  if (!access.membershipId) {
    return fail(
      404,
      "no_membership",
      "There is no membership on this account yet."
    );
  }

  const stripe = getStripe();
  const admin = createAdminClient();

  if (!stripe || !admin) {
    return fail(
      503,
      "billing_unavailable",
      "Billing is not available right now. Please try again a little later."
    );
  }

  // Read through the service role rather than the member's own client. The
  // row-level policy on `memberships` requires an active seat, and the people
  // most likely to need this page are exactly the ones whose membership has
  // lapsed. The ownership check below is done here, in code, instead.
  const { data, error } = await admin
    .from("memberships")
    .select("billing_owner_id, stripe_customer_id")
    .eq("id", access.membershipId)
    .maybeSingle();

  if (error) {
    console.error("[stripe:portal] could not read membership", error);
    return fail(
      502,
      "lookup_failed",
      "We could not open your billing page. Please try again in a moment."
    );
  }

  const membership = (data ?? null) as MembershipBilling | null;

  if (!membership) {
    return fail(404, "no_membership", "There is no membership on this account yet.");
  }

  // The partner seat can read the household but must never be able to change
  // the card, cancel the plan, or see the other person's invoices.
  if (membership.billing_owner_id !== access.userId) {
    return fail(
      403,
      "not_billing_owner",
      "Billing for this membership is held by the other person on it."
    );
  }

  if (!membership.stripe_customer_id) {
    return fail(
      409,
      "no_billing_record",
      "There is nothing to manage on this membership yet."
    );
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: membership.stripe_customer_id,
      return_url: absoluteUrl("/account"),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // The most common cause is a Stripe account with no customer portal
    // configuration saved yet. That is an operator problem, not a member
    // problem, so it is logged loudly and reads calmly.
    console.error("[stripe:portal] could not create portal session", error);
    return fail(
      502,
      "portal_failed",
      "We could not open your billing page. Please try again in a moment."
    );
  }
}
