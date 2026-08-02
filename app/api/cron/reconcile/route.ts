import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Nightly entitlement reconciler.
//
// Webhooks are the fast path and they are not reliable enough to be the only
// path: deliveries get dropped, arrive out of order, or land while a deploy is
// mid-flight. Entitlement drift is silent and the failure is the worst kind
// (someone who paid cannot get in, or someone who cancelled still can), so this
// re-derives access from Stripe, which is the system of record for money.
//
// Secured by CRON_SECRET. Vercel Cron sends it as a Bearer token.

/**
 * Constant-time bearer comparison.
 *
 * `!==` on a secret leaks its prefix through response timing, one byte at a
 * time. The length is compared first and separately because timingSafeEqual
 * throws on differing lengths; that leaks only the length, not the contents.
 */
function bearerMatches(header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  // FAIL CLOSED. This check used to sit inside `if (secret)`, which meant that
  // forgetting to configure CRON_SECRET did not disable the endpoint, it
  // disabled the authentication on it: an unauthenticated caller could drive a
  // service-role write path and one Stripe API call per membership, on demand.
  // A missing secret is a misconfiguration, never a reason to skip the gate.
  if (!secret) {
    console.error("[cron:reconcile] refused: CRON_SECRET is not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  if (!bearerMatches(request.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const stripe = getStripe();
  if (!admin || !stripe) {
    return NextResponse.json({ skipped: "not configured" }, { status: 200 });
  }

  const { data: memberships } = await admin
    .from("memberships")
    .select("id, stripe_subscription_id, tier, status, current_period_end")
    .not("stripe_subscription_id", "is", null);

  let checked = 0;
  let repaired = 0;
  const problems: string[] = [];

  for (const m of memberships ?? []) {
    checked += 1;
    try {
      const sub = await stripe.subscriptions.retrieve(m.stripe_subscription_id as string);
      const periodEnd = new Date(
        (sub as unknown as { current_period_end: number }).current_period_end * 1000
      ).toISOString();

      const nextStatus =
        sub.status === "active" || sub.status === "trialing"
          ? "active"
          : sub.status === "past_due" || sub.status === "unpaid"
            ? "past_due"
            : "canceled";

      const drifted = m.status !== nextStatus || m.current_period_end !== periodEnd;
      if (!drifted) continue;

      await admin
        .from("memberships")
        .update({
          status: nextStatus,
          current_period_end: periodEnd,
          cancel_at_period_end: sub.cancel_at_period_end ?? false,
        })
        .eq("id", m.id);

      // Repair every seat on the household, not just the owner: a partner who
      // silently lost access is exactly the bug nobody reports and everybody
      // resents.
      const { data: seats } = await admin
        .from("membership_seats")
        .select("user_id, role")
        .eq("membership_id", m.id)
        .eq("status", "active");

      const entStatus =
        nextStatus === "active" ? "active" : nextStatus === "past_due" ? "grace" : "none";

      for (const seat of seats ?? []) {
        if (!seat.user_id) continue;
        await admin.from("entitlements").upsert(
          {
            user_id: seat.user_id,
            membership_id: m.id,
            tier: entStatus === "none" ? "free" : m.tier,
            status: entStatus,
            seat_role: seat.role,
            valid_until: periodEnd,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }
      repaired += 1;
    } catch (e) {
      problems.push(`${m.id}: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return NextResponse.json({ checked, repaired, problems }, { status: 200 });
}
