import Link from "next/link";
import { getAccess } from "@/lib/access";
import { billingReady } from "@/lib/env";
import { membershipNote, openingNote } from "@/content/offerings";
import { BloomButton, QuietButton } from "@/components/garden/buttons";
import { JoinButtons } from "@/components/membership/join-buttons";

// The one place a visitor becomes a member, and the one place a member gets
// back in. Everything on this page that says "join" scrolls here.
//
// A visitor arrives in exactly one of four states, and the panel answers each
// with a single obvious action rather than making them work out which link
// applies to them:
//
//   already a member   -> Enter the garden        (no upsell, no second sale)
//   signed in, not yet -> pick a plan, pay        (Stripe hosted checkout)
//   signed out         -> create an account first (a membership needs a person)
//   billing off        -> the founding list       (pre-launch fallback)
//
// Rendered on the server so the state is decided from the session, never
// guessed on the client and never flashed as the wrong thing first.

export async function JoinPanel() {
  const access = await getAccess();
  const canSell = billingReady();

  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:pb-32 lg:px-8"
    >
      <div className="rounded-[2rem] border border-hairline bg-raised px-7 py-10 sm:px-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col gap-4 lg:col-span-6">
            <h2 id="join-title" className="text-display text-balance">
              {access.isMember ? "Your garden is open." : "Be a member today."}
            </h2>
            <p className="text-lede max-w-[52ch]">
              {access.isMember
                ? "You are holding a seat. Everything inside is yours whenever you want it."
                : "Gain exclusive access and membership discounts. Cancel any time."}
            </p>
            {!access.isMember ? (
              <p className="rounded-xl border border-hairline bg-surface px-4 py-3 text-[14px] leading-relaxed text-ink-muted">
                {openingNote}
              </p>
            ) : null}
            <p className="text-[14px] leading-relaxed text-ink-muted">{membershipNote}</p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            {access.isMember ? (
              <div className="flex flex-col gap-3">
                <BloomButton href="/garden">Enter the garden</BloomButton>
                <QuietButton href="/account">Manage your membership</QuietButton>
              </div>
            ) : canSell ? (
              <JoinButtons signedIn={access.signedIn} />
            ) : (
              // Billing not configured: never render a button that cannot work.
              <div className="flex flex-col gap-3">
                <BloomButton href="#founding">Join the founding list</BloomButton>
                <p className="text-[14px] text-ink-muted">
                  Joining opens shortly. Leave your address and you will be the first told.
                </p>
              </div>
            )}

            {/* The returning-member door. Someone who already paid should never
                have to read a sales panel to find the way back in. */}
            {!access.signedIn ? (
              <p className="mt-5 border-t border-hairline pt-4 text-[14px] text-ink-muted">
                Already a member?{" "}
                <Link
                  href="/enter?next=/garden"
                  className="text-gold-text underline decoration-hairline underline-offset-4 transition-colors hover:decoration-current"
                >
                  Sign in
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
