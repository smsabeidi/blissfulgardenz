import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@/content/site";

// The chrome every gate page wears.
//
// It lives outside the (public) route group on purpose: the marketing header
// carries five destinations and two flyouts, and none of them belong in front of
// someone who is trying to get in. A wordmark home, the way in, and nothing else.
//
// Shared by /enter, /enter/reset, and /enter/new-password so the three pages
// cannot drift apart — the reset flow should feel like one room with the light
// moving, not like three different doors.

export function GateFrame({ children }: { children: ReactNode }) {
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
