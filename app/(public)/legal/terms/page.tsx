import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalHeading } from "@/components/legal/legal-shell";
import { brand } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The plain-language agreement between you and Blissful Gardenz Inc for using this site, its resources, and the membership at launch.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Use">
      <p>
        These terms are the agreement between you and {brand.legalName}, the company behind
        Blissful Gardenz and the Three Guys Talking books, for your use of blissfulgardenz.com.
        By using the site you accept them. We have written them to be read, not skimmed past, and
        we have kept them as short as honesty allows.
      </p>

      <LegalHeading>What this site is</LegalHeading>
      <p>
        Blissful Gardenz offers educational and supportive resources for building enduring
        healthy relationships: articles, books, films, guides, and, privately arranged, harmony
        conversations with Dr. Adeyinka Laiyemo. It is a place of encouragement and learning. It
        is not medical care and not an emergency service, as our{" "}
        <Link href="/legal/disclaimer">disclaimer</Link> explains in full.
      </p>

      <LegalHeading>Membership and payments</LegalHeading>
      <p>
        The Inner Garden membership opens soon. When it does, membership fees will be processed
        by Stripe; card details never touch our servers. Membership will be cancel anytime, from
        your account, without phone calls, retention scripts, or guilt. If you cancel, you keep
        access through the period you have already paid for. Founding list membership is free and
        creates no obligation on either side.
      </p>

      <LegalHeading>Your account and the Couple Seat</LegalHeading>
      <p>
        At launch, a membership includes two seats: yours and your partner&rsquo;s. Each seat is
        a personal login for one person. You agree to keep your login to yourself, to give the
        second seat only to your spouse or partner, and to tell us promptly if you believe your
        account has been used without your permission.
      </p>

      <LegalHeading>What belongs to whom</LegalHeading>
      <p>
        The writing, films, guides, artwork, and design of this site, and the Three Guys Talking
        books, belong to {brand.legalName} or its licensors. You may read, watch, and print for
        your own personal use, and we are glad when you share links. You may not republish,
        resell, or redistribute the content itself without our written permission. Anything you
        write to us remains yours; you simply give us permission to read it and respond to it.
      </p>

      <LegalHeading>Using the site kindly</LegalHeading>
      <p>
        You agree not to misuse the site: no attempts to break or probe its security, no
        harvesting of other people&rsquo;s information, no impersonation, and no use of the site
        to harass anyone. We may suspend access that harms the garden or the people in it.
      </p>

      <LegalHeading>Honest limits</LegalHeading>
      <p>
        The site and its resources are provided as they are, with care but without warranties of
        any kind. To the fullest extent the law allows, {brand.legalName} is not liable for
        indirect or consequential losses arising from your use of the site. Nothing in these
        terms limits liability that the law does not allow to be limited. Decisions about your
        relationship and your life remain, always and entirely, your own.
      </p>

      <LegalHeading>Governing law</LegalHeading>
      <p>
        The governing law and venue for these terms will be confirmed by counsel before launch
        and stated here plainly. Until then, this section is a marked placeholder rather than a
        quiet omission.
      </p>

      <LegalHeading>Changes to these terms</LegalHeading>
      <p>
        If we change these terms in a way that matters, we will update the date at the top of
        this page and tell members directly before the change takes effect. Continuing to use
        the site after a change means you accept the updated terms. Questions are welcome through
        the <Link href="/contact">contact page</Link>.
      </p>
    </LegalShell>
  );
}
