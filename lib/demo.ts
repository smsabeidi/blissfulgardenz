import type { Access, Note, VideoProgress } from "@/lib/db/types";

// DEMO MODE.
//
// Lets the whole member experience be shown before Supabase, Google, and Stripe
// are configured. Everything below is in-memory fixture data: nothing is written
// anywhere, and no real account exists.
//
// SAFETY: this is off unless NEXT_PUBLIC_DEMO_MODE is exactly "1". It is not set
// in Vercel, so production is unaffected. Turning it on in production would open
// the member area to everyone, so it is deliberately a single explicit switch
// rather than anything inferred from NODE_ENV.
export function isDemo(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "1";
}

export const DEMO_MEMBER = {
  name: "Amara",
  email: "amara@example.com",
  partnerName: "Tobi",
  renewsOn: "12 March 2027",
  plan: "Bloom, yearly",
};

export const DEMO_ACCESS: Access = {
  signedIn: true,
  userId: "demo-user",
  tier: "bloom",
  status: "active",
  seatRole: "owner",
  membershipId: "demo-membership",
  isMember: true,
};

// A member a few weeks in: one film part-watched, one finished, two notes.
export const DEMO_PROGRESS: VideoProgress[] = [
  {
    user_id: "demo-user",
    video_slug: "the-quiet-season",
    seconds: 512,
    completed: false,
    updated_at: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    user_id: "demo-user",
    video_slug: "the-repair-conversation",
    seconds: 1440,
    completed: true,
    updated_at: new Date(Date.now() - 9 * 864e5).toISOString(),
  },
];

export const DEMO_NOTES: Note[] = [
  {
    id: "demo-note-1",
    user_id: "demo-user",
    context_type: "film",
    context_ref: "the-quiet-season",
    body: "The part about naming the season out loud landed. We have been calling it a busy patch for a year and a half. It is not a busy patch.",
    created_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 2 * 864e5).toISOString(),
    deleted_at: null,
  },
  {
    id: "demo-note-2",
    user_id: "demo-user",
    context_type: "general",
    context_ref: null,
    body: "Try the twenty minute walk before the hard conversation, not after. Wrote it here so I would not talk myself out of it.",
    created_at: new Date(Date.now() - 11 * 864e5).toISOString(),
    updated_at: new Date(Date.now() - 11 * 864e5).toISOString(),
    deleted_at: null,
  },
];

export function demoProgressFor(slug: string): { seconds: number; completed: boolean } {
  const row = DEMO_PROGRESS.find((p) => p.video_slug === slug);
  return { seconds: row?.seconds ?? 0, completed: row?.completed ?? false };
}

export const DEMO_MEMBERSHIP = {
  currentPeriodEnd: new Date(Date.now() + 230 * 864e5).toISOString(),
};

// Owner plus an active partner seat, so the Couple Seat panel demonstrates the
// state that matters: two people, one membership, two sealed private gardens.
export const DEMO_SEATS = [
  {
    id: "demo-seat-owner",
    role: "owner" as const,
    status: "active" as const,
    invited_email: null as string | null,
    user_id: "demo-user",
    joined_at: new Date(Date.now() - 40 * 864e5).toISOString(),
  },
  {
    id: "demo-seat-partner",
    role: "partner" as const,
    status: "active" as const,
    invited_email: "tobi@example.com" as string | null,
    user_id: "demo-partner",
    joined_at: new Date(Date.now() - 33 * 864e5).toISOString(),
  },
];
