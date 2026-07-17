import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalHeading } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "What this site stores on your device today (almost nothing) and what will change, with your consent, when the membership opens.",
};

export default function CookiesPage() {
  return (
    <LegalShell title="Cookie Policy">
      <p>
        Cookies are small files a website places on your device to remember things between
        visits. Some sites use dozens. We prefer a quieter approach: today, blissfulgardenz.com
        sets no advertising cookies, no tracking cookies, and no third-party cookies at all.
      </p>

      <LegalHeading>What we store today</LegalHeading>
      <p>
        One thing: your Dawn or Dusk theme preference, kept in your browser&rsquo;s local
        storage (a cousin of cookies that never leaves your device). It exists so the garden
        greets you in the light you chose. It contains no personal information, it is not sent to
        us or to anyone else, and clearing your browser data removes it.
      </p>

      <LegalHeading>What will change at launch</LegalHeading>
      <p>
        When the Inner Garden opens, three careful additions are planned. First,
        privacy-respecting analytics, gated behind your consent: no analytics cookie will be set
        unless you say yes, and declining will never diminish the site. Second, Stripe will set
        the cookies it needs to process payments securely during checkout. Third, Mux, our video
        platform, may use functional cookies so member films play smoothly. Each will be listed
        here, by name and purpose, before it is switched on.
      </p>

      <LegalHeading>Strictly necessary storage</LegalHeading>
      <p>
        At launch, signing in to your membership will require a session cookie, the kind that
        simply keeps you signed in as you move from page to page. Cookies of this kind are
        strictly necessary for the service you asked for and do not require consent, though we
        list them here because you deserve to know about them.
      </p>

      <LegalHeading>Managing your preferences</LegalHeading>
      <p>
        You will be able to review and change your consent choices at any time from a link in the
        site footer once analytics arrive. Your browser also gives you controls to view, block,
        and delete cookies and local storage for any site, including this one. Blocking our
        storage will not break your reading; at most, the site will forget your theme.
      </p>

      <LegalHeading>Questions</LegalHeading>
      <p>
        If anything here is unclear, or you want to know exactly what is stored for you, write to
        us through the <Link href="/contact">contact page</Link>. Our{" "}
        <Link href="/legal/privacy">privacy policy</Link> explains the rest of what we do, and do
        not do, with your information.
      </p>
    </LegalShell>
  );
}
