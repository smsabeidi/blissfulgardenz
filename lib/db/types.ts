// The Inner Garden data model, in TypeScript.
//
// Two rules govern this file and the SQL that mirrors it:
//   1. A person is never modelled as "a user with a partner". Household state
//      lives in `memberships` + `membership_seats`, so separation, billing
//      transfer, death, and leave-and-return are row changes, not migrations.
//   2. No per-person private table carries a `membership_id`. That is what makes
//      "your partner can never read your notes" structural instead of a promise
//      someone has to remember to keep.

export type Tier = "free" | "bloom";
export type MembershipStatus = "trialing" | "active" | "past_due" | "canceled" | "incomplete";
export type SeatRole = "owner" | "partner";
export type SeatStatus = "invited" | "active" | "left" | "removed";
export type EntitlementStatus = "active" | "grace" | "none";
export type MembershipOrigin = "self" | "gift" | "comp" | "founding";

export type Profile = {
  id: string;
  display_name: string | null;
  timezone: string | null;
  /** Private and self-declared. Never shown to the other seat. */
  season: string | null;
  comms_prefs: { letters?: boolean; product?: boolean } | null;
  platform_role: "member" | "staff";
  created_at: string;
  deleted_at: string | null;
};

export type Membership = {
  id: string;
  tier: Tier;
  status: MembershipStatus;
  billing_owner_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  grace_until: string | null;
  seat_limit: number;
  origin: MembershipOrigin;
  created_at: string;
};

export type MembershipSeat = {
  id: string;
  membership_id: string;
  user_id: string | null;
  role: SeatRole;
  status: SeatStatus;
  invited_email: string | null;
  invite_expires_at: string | null;
  joined_at: string | null;
  left_at: string | null;
};

/** Materialized access. Read once per member-layout render. Service-role write only. */
export type Entitlement = {
  user_id: string;
  membership_id: string | null;
  tier: Tier;
  status: EntitlementStatus;
  seat_role: SeatRole | null;
  valid_until: string | null;
  updated_at: string;
};

/** Deliberately has NO membership_id. See rule 2 above. */
export type Note = {
  id: string;
  user_id: string;
  context_type: "film" | "guide" | "general";
  context_ref: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type VideoProgress = {
  user_id: string;
  video_slug: string;
  seconds: number;
  completed: boolean;
  updated_at: string;
};

export type SavedItem = {
  user_id: string;
  item_type: "film" | "guide" | "article";
  item_ref: string;
  created_at: string;
};

export type FoundingListEntry = {
  id: string;
  email: string;
  source: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

/** The access decision, resolved once and passed down. */
export type Access = {
  signedIn: boolean;
  userId: string | null;
  tier: Tier;
  status: EntitlementStatus;
  seatRole: SeatRole | null;
  membershipId: string | null;
  /** True when content behind the paywall should render. */
  isMember: boolean;
};

export const NO_ACCESS: Access = {
  signedIn: false,
  userId: null,
  tier: "free",
  status: "none",
  seatRole: null,
  membershipId: null,
  isMember: false,
};
