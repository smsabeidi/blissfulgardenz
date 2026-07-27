"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Accepting a second seat. Split into its own file from app/actions/seat.ts
// because acceptance is the one seat operation performed by someone who is NOT
// yet part of the household, so its trust model is different: the invite token
// is the only credential, and it must be spent exactly once.

export type AcceptResult =
  | { status: "ok" }
  | { status: "invalid"; reason: string }
  | { status: "failed" };

export async function acceptSeatInvite(token: string): Promise<AcceptResult> {
  const supabase = await createClient();
  const admin = createAdminClient();
  if (!supabase || !admin) return { status: "failed" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "invalid", reason: "Please sign in first." };

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const { data: seat } = await admin
    .from("membership_seats")
    .select("id, membership_id, status, invite_expires_at, role")
    .eq("invite_token_hash", tokenHash)
    .maybeSingle();

  if (!seat || seat.status !== "invited") {
    return { status: "invalid", reason: "This invitation is no longer available." };
  }
  if (seat.invite_expires_at && new Date(seat.invite_expires_at) < new Date()) {
    return { status: "invalid", reason: "This invitation has expired. Ask for a new one." };
  }

  // One active seat per person, enforced by a unique index. Check first so we can
  // explain it kindly instead of surfacing a constraint violation.
  const { data: existing } = await admin
    .from("membership_seats")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();
  if (existing) {
    return {
      status: "invalid",
      reason: "You already hold a seat on a membership. Leave that one first.",
    };
  }

  const { data: membership } = await admin
    .from("memberships")
    .select("id, tier, status, current_period_end")
    .eq("id", seat.membership_id)
    .maybeSingle();
  if (!membership) return { status: "failed" };

  // Claim the seat and spend the token in the same update.
  const { error: claimError } = await admin
    .from("membership_seats")
    .update({
      user_id: user.id,
      status: "active",
      joined_at: new Date().toISOString(),
      invite_token_hash: null,
      invite_expires_at: null,
    })
    .eq("id", seat.id)
    .eq("status", "invited");
  if (claimError) return { status: "failed" };

  // Both seats carry identical content entitlement. There is no second-class
  // partner: the only asymmetry in this product is who controls billing.
  const active = membership.status === "active" || membership.status === "trialing";
  const { error: entError } = await admin.from("entitlements").upsert(
    {
      user_id: user.id,
      membership_id: membership.id,
      tier: membership.tier,
      status: active ? "active" : "grace",
      seat_role: "partner",
      valid_until: membership.current_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (entError) return { status: "failed" };

  revalidatePath("/garden");
  revalidatePath("/account");
  return { status: "ok" };
}
