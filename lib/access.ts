import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { NO_ACCESS, type Access, type Tier, type EntitlementStatus, type SeatRole } from "@/lib/db/types";

// The one place that answers "is this person a paid member right now".
//
// Deliberately NOT a JWT claim. Putting entitlement in the token buys a single
// indexed lookup and costs a staleness window plus forced session-refresh
// choreography at five lifecycle points. This reads one row, memoized per
// request with React cache(), so a member who just paid is a member instantly
// and an entitlement migration can never break sign-in.
export const getAccess = cache(async (): Promise<Access> => {
  const supabase = await createClient();
  if (!supabase) return NO_ACCESS;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NO_ACCESS;

  const { data } = await supabase
    .from("entitlements")
    .select("tier, status, seat_role, membership_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const tier = (data?.tier ?? "free") as Tier;
  const status = (data?.status ?? "none") as EntitlementStatus;

  return {
    signedIn: true,
    userId: user.id,
    tier,
    status,
    seatRole: (data?.seat_role ?? null) as SeatRole | null,
    membershipId: data?.membership_id ?? null,
    // Grace counts as access on purpose: a failed card should never lock someone
    // out mid-conversation. Dunning handles recovery, not a slammed door.
    isMember: tier === "bloom" && (status === "active" || status === "grace"),
  };
});
