import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { platformReady } from "@/lib/env";
import { getAccess } from "@/lib/access";
import { brand } from "@/content/site";
import { Eyebrow, EmptyState, PetalCard } from "@/components/garden/primitives";
import { BloomButton } from "@/components/garden/buttons";
import { EnterForm } from "./enter-form";

// The gate to The Inner Garden. It lives outside the (public) route group on
// purpose: the marketing header carries five destinations and two flyouts, and
// none of them belong in front of someone who is trying to get in. A wordmark
// home, the way in, and two quiet doors out.

export const metadata: Metadata = {
  title: "Enter the garden",
  description: "Sign in to The Inner Garden.",
  // Nothing here is worth indexing, and a signed-out gate in search results is
  // a confusing first impression of a members area.
  robots: { index: false, follow: false },
};

/** The gate only ever forwards to a path on this site. Anything absolute, or
 *  protocol-relative (which "//evil.example" is), becomes the garden door. */
function safeNext(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "/garden";
  if (!value.startsWith("/") || value.startsWith("//")) return "/garden";
  return value;
}

// The callback route speaks in short codes so nothing from the auth provider
// is ever reflected back into the page.
const ERRORS: Record<string, string> = {
  oauth: "That sign in did not finish. Please try once more.",
  missing: "That link came back without what we needed. Please sign in again below.",
  exchange: "That link has already been used, or it has expired. A fresh code is below.",
  unavailable: "The gate is closed just now. Please try again shortly.",
};

function Frame({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden className="horizon-rule fixed inset-x-0 top-0 z-10" />
      <header className="w-full px-5 py-6 lg:px-8">
        <Link
          href="/"
          aria-label={`${brand.name}, home`}
          className="group inline-flex min-h-11 items-baseline gap-1.5"
        >
          <span className="text-[1.2rem] font-medium lowercase tracking-[-0.01em]">blissful</span>
          <span className="font-[family-name:var(--font-display)] text-[1.3rem] font-[520] lowercase italic tracking-[-0.01em]">
            gardenz
          </span>
        </Link>
      </header>
      <main id="main" className="flex flex-1 items-center justify-center px-5 pb-20 pt-4 lg:px-8">
        <div className="w-full max-w-[30rem]">{children}</div>
      </main>
    </>
  );
}

export default async function EnterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const errorKey = typeof params.error === "string" ? params.error : null;
  const errorMessage = errorKey ? (ERRORS[errorKey] ?? ERRORS.oauth) : null;

  // Already signed in? Then this page is a dead end dressed as a door. Send
  // them where they were going instead of asking a member to sign in twice.
  // Only when there is no error to explain: a failed callback lands here with
  // a stale session sometimes, and bouncing that away hides the reason.
  if (!errorKey) {
    const access = await getAccess();
    if (access.signedIn) redirect(next);
  }

  // No keys, no gate. The marketing site is unaffected and nobody is left
  // staring at a sign-in form that cannot possibly work.
  if (!platformReady()) {
    return (
      <Frame>
        <EmptyState
          title="The garden is not open yet"
          body="The Inner Garden opens soon. Join the founding list and you will be among the first through the gate."
          action={<BloomButton href="/membership">Explore the membership</BloomButton>}
        />
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="flex flex-col gap-4">
        <Eyebrow>The Inner Garden</Eyebrow>
        <h1 className="text-display text-balance">Enter the garden</h1>
        <p className="text-lede">
          Your notes, films, and guides are where you left them. No password to remember.
        </p>
      </div>

      {/* Server rendered, so this is not a live region: it is simply read in
          document order, between the heading and the form it explains. */}
      {errorMessage ? (
        <p className="mt-6 rounded-xl border border-error/40 bg-raised px-4 py-3 text-[14px] leading-relaxed text-error">
          {errorMessage}
        </p>
      ) : null}

      <PetalCard className="mt-8">
        <EnterForm next={next} />
      </PetalCard>

      <div className="mt-8 flex flex-col gap-1 text-[15px] text-ink-muted">
        <p>
          New here?{" "}
          <Link
            href="/membership"
            className="inline-block py-1 font-medium text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current motion-reduce:transition-none"
          >
            Explore the membership
          </Link>
        </p>
        <p>
          Trouble getting in?{" "}
          <Link
            href="/contact"
            className="inline-block py-1 font-medium text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current motion-reduce:transition-none"
          >
            Write to us
          </Link>
        </p>
      </div>
    </Frame>
  );
}
