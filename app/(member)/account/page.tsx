import Link from "next/link";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_MEMBERSHIP, DEMO_SEATS } from "@/lib/demo";
import { MemberSection } from "@/components/member/section";
import { AccountClient } from "./account-client";
import { SecurityClient } from "./security-client";
import { SeatPanel } from "@/components/member/seat-panel";
import { ManageBillingButton } from "@/components/member/manage-billing";

export const metadata = { title: "Your account" };

// Account: details, membership, the second seat, and the way out.
//
// The way out is deliberately easy to find. A cancel path buried three levels
// down converts slightly better and poisons the thing this brand is selling,
// which is trust from people at a vulnerable moment.
export default async function AccountPage() {
  const access = await getAccess();
  const supabase = await createClient();

  if (!supabase || !access.userId) {
    return (
      <div className="pb-24">
        <MemberSection as="h1" title="Your account" width="reading">
          <p className="text-body text-ink-muted">
            We cannot reach your details just now. Please try again in a moment.
          </p>
        </MemberSection>
      </div>
    );
  }

  const [{ data: userRes }, { data: profile }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("display_name, timezone, comms_prefs")
      .eq("id", access.userId)
      .maybeSingle(),
  ]);

  // Demo mode fills the household from fixtures so the account surface can be
  // shown before the database exists. Nothing is written.
  const { data: membership } = isDemo()
    ? {
        data: {
          tier: "bloom" as const,
          status: "active" as const,
          current_period_end: DEMO_MEMBERSHIP.currentPeriodEnd,
          cancel_at_period_end: false,
          seat_limit: 2,
          billing_owner_id: access.userId,
        },
      }
    : access.membershipId
      ? await supabase
          .from("memberships")
          .select("tier, status, current_period_end, cancel_at_period_end, seat_limit, billing_owner_id")
          .eq("id", access.membershipId)
          .maybeSingle()
      : { data: null };

  const { data: seatRows } = isDemo()
    ? { data: DEMO_SEATS }
    : access.membershipId
      ? await supabase
          .from("membership_seats")
          .select("id, role, status, invited_email, user_id, joined_at")
          .eq("membership_id", access.membershipId)
      : { data: null };

  // Resolve partner display names without exposing profile rows to the other
  // seat: RLS keeps profiles self-only, so names come from the seat owner's own
  // view only where a row is already visible. Absent a name we simply say less.
  const seats = (seatRows ?? []).map((s) => ({
    id: s.id,
    role: s.role as "owner" | "partner",
    status: s.status as "invited" | "active" | "left" | "removed",
    invitedEmail: s.invited_email,
    displayName: s.user_id === access.userId ? (profile?.display_name ?? null) : null,
    joinedAt: s.joined_at,
  }));

  const isOwner = access.seatRole === "owner";
  const prefs = (profile?.comms_prefs ?? {}) as { letters?: boolean; product?: boolean };

  return (
    <div className="pb-24">
      <MemberSection as="h1" title="Your account" width="reading" />

      <MemberSection title="Your details" width="reading">
        <AccountClient
          email={userRes?.user?.email ?? ""}
          displayName={profile?.display_name ?? null}
          timezone={profile?.timezone ?? null}
          letters={prefs.letters !== false}
          product={prefs.product !== false}
        />
      </MemberSection>

      {/* Only with a real session behind it. In demo mode there is no auth user,
          and a security panel that cannot tell you how you signed in is worse
          than no panel at all. */}
      {userRes?.user ? (
        <MemberSection title="Sign-in and security" width="reading">
          <SecurityClient
            providers={(userRes.user.identities ?? []).map((i) => i.provider)}
            email={userRes.user.email ?? ""}
          />
        </MemberSection>
      ) : null}

      <MemberSection title="Your membership" width="reading">
        {membership ? (
          <div className="flex flex-col gap-4">
            <dl className="flex flex-col divide-y divide-hairline border-y border-hairline">
              <Row label="Plan" value={membership.tier === "bloom" ? "Bloom" : "Free"} />
              <Row label="Status" value={statusLabel(membership.status, access.status)} />
              {membership.current_period_end ? (
                <Row
                  label={membership.cancel_at_period_end ? "Access until" : "Renews"}
                  value={new Date(membership.current_period_end).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
              ) : null}
            </dl>
            {isOwner ? (
              <div className="flex flex-col gap-2">
                <ManageBillingButton />
                <p className="text-[13px] text-ink-muted">
                  Opens Stripe, where you can change your card, switch between monthly and yearly,
                  or cancel. Cancelling keeps your access until the date above.
                </p>
              </div>
            ) : (
              <p className="text-[15px] text-ink-muted">
                Billing is managed by the person who opened this membership.
              </p>
            )}
          </div>
        ) : (
          <p className="text-body text-ink-muted">No membership is attached to this account yet.</p>
        )}
      </MemberSection>

      <MemberSection title="The second seat" width="reading">
        <SeatPanel seats={seats} isOwner={isOwner} seatLimit={membership?.seat_limit ?? 2} />
      </MemberSection>

      <MemberSection title="Leaving" width="reading">
        <p className="text-body text-ink-muted">
          You can cancel at any time and keep your access until the end of the period you have paid
          for. If you would like your account and everything in it deleted, write to us and we will
          do it, and tell you when it is done.
        </p>
        <p className="mt-4">
          <Link
            href="/contact"
            className="text-[15px] font-medium text-gold-text underline-offset-4 hover:underline"
          >
            Write to us
          </Link>
        </p>
      </MemberSection>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4">
      <dt className="text-[15px] text-ink-muted">{label}</dt>
      <dd className="text-[15px] font-medium">{value}</dd>
    </div>
  );
}

function statusLabel(status: string, entitlement: string): string {
  if (status === "active" || status === "trialing") return "Active";
  if (status === "past_due") {
    return entitlement === "grace"
      ? "A payment did not go through. Your access continues while we retry."
      : "A payment did not go through.";
  }
  if (status === "canceled") return "Ended";
  return "Getting set up";
}
