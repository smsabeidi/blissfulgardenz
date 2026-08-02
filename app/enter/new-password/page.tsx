import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { platformReady } from "@/lib/env";
import { Eyebrow, EmptyState, PetalCard } from "@/components/garden/primitives";
import { BloomButton } from "@/components/garden/buttons";
import { GateFrame } from "../frame";
import { NewPasswordForm } from "./new-password-form";

// Where a recovery link lands, once /auth/confirm has verified it and opened a
// session. Outside the middleware matcher on purpose — a matcher that guarded
// this would bounce people to /enter to sign in, which is the one thing they
// cannot do.

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default async function NewPasswordPage() {
  if (!platformReady()) {
    return (
      <GateFrame>
        <EmptyState
          title="The garden is not open yet"
          body="The Inner Garden opens soon."
          action={<BloomButton href="/membership">Explore the membership</BloomButton>}
        />
      </GateFrame>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  // No session means the link expired, was already used, or was opened after a
  // sign-out. Say so plainly and offer the next step rather than an empty form
  // that will fail on submit.
  if (!user) {
    return (
      <GateFrame>
        <div className="flex flex-col gap-4">
          <Eyebrow>The Inner Garden</Eyebrow>
          <h1 className="text-display text-balance">That link has expired</h1>
          <p className="text-lede">
            Reset links are good for an hour and can be used once. Ask for another and we will send
            a fresh one straight away.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <BloomButton href="/enter/reset">Send me a new link</BloomButton>
        </div>
      </GateFrame>
    );
  }

  return (
    <GateFrame>
      <div className="flex flex-col gap-4">
        <Eyebrow>The Inner Garden</Eyebrow>
        <h1 className="text-display text-balance">Choose a new password</h1>
        <p className="text-lede">
          For <span className="font-medium">{user.email}</span>. Once it is saved you are signed in
          and on your way.
        </p>
      </div>

      <PetalCard className="mt-8">
        <NewPasswordForm />
      </PetalCard>

      <div className="mt-8 text-[15px] text-ink-muted">
        <p>
          Changed your mind?{" "}
          <Link
            href="/garden"
            className="inline-block py-1 font-medium text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current motion-reduce:transition-none"
          >
            Go to the garden
          </Link>
        </p>
      </div>
    </GateFrame>
  );
}
