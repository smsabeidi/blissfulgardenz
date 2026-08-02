import type { Metadata } from "next";
import Link from "next/link";
import { platformReady } from "@/lib/env";
import { Eyebrow, EmptyState, PetalCard } from "@/components/garden/primitives";
import { BloomButton } from "@/components/garden/buttons";
import { GateFrame } from "../frame";
import { ResetForm } from "./reset-form";

// Asking for a way back in. Deliberately not gated on being signed out: someone
// half-signed-in on a shared machine should still be able to reach this.

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Ask for a link to set a new password.",
  robots: { index: false, follow: false },
};

export default function ResetPage() {
  if (!platformReady()) {
    return (
      <GateFrame>
        <EmptyState
          title="The garden is not open yet"
          body="The Inner Garden opens soon. Join the founding list and you will be among the first through the gate."
          action={<BloomButton href="/membership">Explore the membership</BloomButton>}
        />
      </GateFrame>
    );
  }

  return (
    <GateFrame>
      <div className="flex flex-col gap-4">
        <Eyebrow>The Inner Garden</Eyebrow>
        <h1 className="text-display text-balance">Set a new password</h1>
        <p className="text-lede">
          Tell us the address you use, and we will send a link that lets you choose a new one.
        </p>
      </div>

      <PetalCard className="mt-8">
        <ResetForm />
      </PetalCard>

      <div className="mt-8 flex flex-col gap-1 text-[15px] text-ink-muted">
        <p>
          Signed in with Google or Apple?{" "}
          <Link
            href="/enter"
            className="inline-block py-1 font-medium text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current motion-reduce:transition-none"
          >
            Go back and use that instead
          </Link>
        </p>
        <p>
          Still stuck?{" "}
          <Link
            href="/contact"
            className="inline-block py-1 font-medium text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current motion-reduce:transition-none"
          >
            Write to us
          </Link>
        </p>
      </div>
    </GateFrame>
  );
}
