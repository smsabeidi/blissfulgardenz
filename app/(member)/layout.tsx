import type { Metadata } from "next";
import { getAccess } from "@/lib/access";
import { MemberNav } from "@/components/member/member-nav";
import { MemberFooter } from "@/components/member/member-footer";
import { PaywallNotice } from "@/components/member/paywall-notice";

// Member routes are private by definition. Set on the layout so every page in
// the group inherits it without having to remember.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// The shell for everything behind the gate.
//
// Two deliberate non-behaviours:
//   1. It does not redirect. middleware.ts already sends unauthenticated
//      traffic to /enter, and a second redirect here would race it and could
//      strand someone in a loop if the two ever disagreed.
//   2. It does not throw or 403 a signed-in non-member. It swaps the children
//      for an invitation, which means a person who let a card expire lands on
//      warmth rather than an error, and every member route gets that behaviour
//      for free instead of each page reimplementing the check.
export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const access = await getAccess();

  return (
    <>
      <a href="#garden-main" className="skip-link">
        Skip to content
      </a>
      <MemberNav />
      <main id="garden-main" className="flex-1 bg-canvas">
        <div className="mx-auto w-full max-w-5xl px-5 lg:px-8">
          {access.isMember ? children : <PaywallNotice />}
        </div>
      </main>
      <MemberFooter />
    </>
  );
}
