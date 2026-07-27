import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isFoundingPriceId } from "@/lib/stripe";
import type {
  EntitlementStatus,
  MembershipOrigin,
  MembershipStatus,
} from "@/lib/db/types";

// The single provisioning path. The webhook calls it, and any return-URL
// reconciliation calls it. Both converge on the same rows because the
// subscription id is UNIQUE in Postgres, so the database, not our sequencing,
// is what prevents a member ending up with two memberships.
//
// Everything here is idempotent. Running it five times with the same
// subscription leaves exactly the state that running it once leaves.

/** How long a failed card keeps the gate open. Dunning recovers people; a
 *  slammed door does not. Recorded on the membership for the reconciler. */
const GRACE_DAYS = 14;

const UNIQUE_VIOLATION = "23505";

type ProvisionWarning = "seat_conflict";

export type ProvisionResult =
  | {
      ok: true;
      userId: string;
      membershipId: string;
      membershipStatus: MembershipStatus;
      entitlementStatus: EntitlementStatus;
      /** Non-fatal. Money and access are correct; a person should look at the seat. */
      warning: ProvisionWarning | null;
    }
  | {
      ok: false;
      /**
       * `unconfigured`     the deploy has no service-role key. Retrying helps once configured.
       * `unidentified_user` no user id on the subscription, the session, or an existing row.
       *                     Retrying the identical payload cannot fix this.
       * `write_failed`      the database rejected a write. Retrying is worth it.
       */
      reason: "unconfigured" | "unidentified_user" | "write_failed";
      message: string;
    };

// Stripe's subscription status vocabulary is wider than ours on purpose: it
// distinguishes states that mean the same thing to a member. Both maps are
// exhaustive over Stripe's enum so a new status becomes a type error here rather
// than a silent fallthrough that grants or revokes access by accident.
const MEMBERSHIP_STATUS: Record<Stripe.Subscription.Status, MembershipStatus> = {
  trialing: "trialing",
  active: "active",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "canceled",
  incomplete: "incomplete",
  incomplete_expired: "canceled",
  paused: "canceled",
};

const ENTITLEMENT_STATUS: Record<Stripe.Subscription.Status, EntitlementStatus> = {
  trialing: "active",
  active: "active",
  past_due: "grace",
  canceled: "none",
  unpaid: "none",
  incomplete: "none",
  incomplete_expired: "none",
  paused: "none",
};

type MembershipLookup = {
  id: string;
  billing_owner_id: string | null;
  origin: MembershipOrigin;
};

type SeatLookup = {
  id: string;
  user_id: string | null;
  status: string;
  joined_at: string | null;
};

function toIso(seconds: number | null | undefined): string | null {
  return typeof seconds === "number" && Number.isFinite(seconds)
    ? new Date(seconds * 1000).toISOString()
    : null;
}

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/**
 * Stripe moved the billing period off the subscription and onto its items. There
 * is no `subscription.current_period_end` any more, so reading it would hand us
 * `undefined` and write a null `valid_until` on every single member. We take the
 * latest period end across items, which is the date the household is paid
 * through even when a subscription carries more than one line.
 */
function periodEndOf(subscription: Stripe.Subscription): string | null {
  let latest: number | null = null;
  for (const item of subscription.items?.data ?? []) {
    const end = item.current_period_end;
    if (typeof end === "number" && (latest === null || end > latest)) latest = end;
  }
  if (latest !== null) return toIso(latest);
  // A subscription that never produced an item period (incomplete, or canceled
  // before its first invoice) still has a meaningful horizon.
  return toIso(subscription.trial_end ?? subscription.cancel_at ?? null);
}

function graceUntilOf(
  subscription: Stripe.Subscription,
  periodEnd: string | null
): string | null {
  if (subscription.status !== "past_due") return null;
  // Anchored to the period end rather than to "now" so repeated dunning events
  // recompute the same instant instead of ratcheting the window forward.
  const anchor = periodEnd ? new Date(periodEnd) : new Date();
  return new Date(anchor.getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

export async function provisionFromSubscription(
  subscription: Stripe.Subscription,
  userId?: string | null
): Promise<ProvisionResult> {
  const admin = createAdminClient();
  if (!admin) {
    return {
      ok: false,
      reason: "unconfigured",
      message: "Supabase service role is not configured, so nothing was provisioned.",
    };
  }

  const customerId = idOf(subscription.customer);
  const membershipStatus = MEMBERSHIP_STATUS[subscription.status];
  const entitlementStatus = ENTITLEMENT_STATUS[subscription.status];
  const periodEnd = periodEndOf(subscription);
  const primaryItem = subscription.items?.data?.[0] ?? null;
  const primaryPriceId = primaryItem?.price?.id ?? null;

  // ── 1. Find the row this subscription belongs to ──────────────────────────
  //
  // By subscription id first. Then by customer id, because a member who cancels
  // and rejoins months later reuses the same Stripe customer: their old
  // membership row already holds that customer id, and `stripe_customer_id` is
  // UNIQUE, so blindly inserting a second row would fail and leave someone who
  // has just paid with no access at all. Reusing the row also keeps their seat
  // and their history intact.
  const bySubscription = await admin
    .from("memberships")
    .select("id, billing_owner_id, origin")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  let existing = (bySubscription.data ?? null) as MembershipLookup | null;

  if (!existing && customerId) {
    const byCustomer = await admin
      .from("memberships")
      .select("id, billing_owner_id, origin")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    existing = (byCustomer.data ?? null) as MembershipLookup | null;
  }

  // ── 2. Decide who owns this ───────────────────────────────────────────────
  //
  // An existing row wins over the caller and over Stripe metadata so that a
  // billing transfer, once performed, is not undone by the next webhook
  // replaying the original purchaser's id.
  const metadataUserId =
    typeof subscription.metadata?.user_id === "string" && subscription.metadata.user_id.length > 0
      ? subscription.metadata.user_id
      : null;

  const ownerId = existing?.billing_owner_id ?? userId ?? metadataUserId ?? null;

  if (!ownerId) {
    return {
      ok: false,
      reason: "unidentified_user",
      message: `Subscription ${subscription.id} carries no user id and matches no membership.`,
    };
  }

  // A profile row is the foreign key target for both the membership and the
  // entitlement. The auth trigger normally creates it at sign-up; this is the
  // belt to that braces. If it were ever missing, provisioning would fail and
  // somebody who has paid would be locked out, which is the one outcome worth
  // spending a round trip to prevent. Insert-or-nothing, so it never overwrites
  // a name or a preference.
  await admin.from("profiles").upsert({ id: ownerId }, { onConflict: "id", ignoreDuplicates: true });

  // ── 3. Write the membership ───────────────────────────────────────────────
  //
  // `origin` is preserved when the row exists so a comped or gifted membership
  // is never relabelled by a later webhook, and derived from the price only on
  // first write.
  const origin: MembershipOrigin =
    existing?.origin ?? (isFoundingPriceId(primaryPriceId) ? "founding" : "self");

  const membershipRow = {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    tier: "bloom" as const,
    status: membershipStatus,
    billing_owner_id: ownerId,
    current_period_end: periodEnd,
    cancel_at_period_end: subscription.cancel_at_period_end === true,
    grace_until: graceUntilOf(subscription, periodEnd),
    origin,
    founding_price_lookup_key:
      origin === "founding" ? (primaryItem?.price?.lookup_key ?? null) : null,
  };

  let membershipId: string | null = null;

  if (existing) {
    const updated = await admin
      .from("memberships")
      .update(membershipRow)
      .eq("id", existing.id)
      .select("id")
      .single();

    if (updated.error) {
      return {
        ok: false,
        reason: "write_failed",
        message: `Could not update membership ${existing.id}: ${updated.error.message}`,
      };
    }
    membershipId = (updated.data as { id: string }).id;
  } else {
    // The genuine race: the webhook and a return-URL reconciliation both
    // arriving for a brand new subscription. UNIQUE(stripe_subscription_id)
    // turns the second one into an update of the first one's row.
    const inserted = await admin
      .from("memberships")
      .upsert(membershipRow, { onConflict: "stripe_subscription_id" })
      .select("id")
      .single();

    if (inserted.error) {
      return {
        ok: false,
        reason: "write_failed",
        message: `Could not create membership for ${subscription.id}: ${inserted.error.message}`,
      };
    }
    membershipId = (inserted.data as { id: string }).id;
  }

  // ── 4. The owner seat ─────────────────────────────────────────────────────
  const seatLookup = await admin
    .from("membership_seats")
    .select("id, user_id, status, joined_at")
    .eq("membership_id", membershipId)
    .eq("role", "owner")
    .limit(1)
    .maybeSingle();

  const ownerSeat = (seatLookup.data ?? null) as SeatLookup | null;
  const now = new Date().toISOString();
  let warning: ProvisionWarning | null = null;

  if (!ownerSeat) {
    const seatInsert = await admin.from("membership_seats").insert({
      membership_id: membershipId,
      user_id: ownerId,
      role: "owner",
      status: "active",
      joined_at: now,
    });

    // `seat_one_active_per_user` allows a person exactly one active seat
    // anywhere. If they already hold one in another household, the insert is
    // refused. That is the constraint doing its job, and it is not a reason to
    // withhold access from someone who has paid: we record the membership and
    // the entitlement, and surface a warning for a human to reconcile.
    if (seatInsert.error) {
      if (seatInsert.error.code === UNIQUE_VIOLATION) {
        warning = "seat_conflict";
      } else {
        return {
          ok: false,
          reason: "write_failed",
          message: `Could not create the owner seat: ${seatInsert.error.message}`,
        };
      }
    }
  } else if (
    // Claiming an unfilled seat, or reopening the seat of a member who left and
    // came back. A seat already held by a different person is left alone: that
    // is a transfer, and transfers are not a billing webhook's decision to make.
    (ownerSeat.user_id === null || ownerSeat.user_id === ownerId) &&
    (ownerSeat.user_id !== ownerId || ownerSeat.status !== "active")
  ) {
    const seatUpdate = await admin
      .from("membership_seats")
      .update({
        user_id: ownerId,
        status: "active",
        joined_at: ownerSeat.joined_at ?? now,
        left_at: null,
      })
      .eq("id", ownerSeat.id);

    if (seatUpdate.error) {
      if (seatUpdate.error.code === UNIQUE_VIOLATION) {
        warning = "seat_conflict";
      } else {
        return {
          ok: false,
          reason: "write_failed",
          message: `Could not reopen the owner seat: ${seatUpdate.error.message}`,
        };
      }
    }
  }

  // ── 5. The entitlement ────────────────────────────────────────────────────
  //
  // Written last, and deliberately so. Entitlements is the only table
  // `getAccess()` reads, so if any earlier write fails we have granted nothing.
  // Tier stays 'bloom' even when status is 'none': the tier records what was
  // bought, the status records whether it is currently open.
  const entitlement = await admin.from("entitlements").upsert(
    {
      user_id: ownerId,
      membership_id: membershipId,
      tier: "bloom" as const,
      status: entitlementStatus,
      seat_role: "owner" as const,
      valid_until: periodEnd,
      updated_at: now,
    },
    { onConflict: "user_id" }
  );

  if (entitlement.error) {
    return {
      ok: false,
      reason: "write_failed",
      message: `Could not write the entitlement for ${ownerId}: ${entitlement.error.message}`,
    };
  }

  return {
    ok: true,
    userId: ownerId,
    membershipId,
    membershipStatus,
    entitlementStatus,
    warning,
  };
}
