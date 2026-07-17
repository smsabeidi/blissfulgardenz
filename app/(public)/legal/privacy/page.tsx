import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalHeading } from "@/components/legal/legal-shell";
import { brand } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Blissful Gardenz collects, uses, and protects the little information you share with us, and the rights you keep over all of it.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p>
        {brand.legalName} (&ldquo;Blissful Gardenz&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
        believes a garden should be a private place. This policy explains what information we
        collect through blissfulgardenz.com, why we collect it, and the choices you keep over it.
        We collect as little as we can, and we treat what you share as carefully as we would want
        our own words treated.
      </p>

      <LegalHeading>What we collect</LegalHeading>
      <p>
        We collect personal information only when you give it to us through a form on this site.
        That means your email address when you join the founding list or subscribe to Seeds of
        Harmony, and your name, email address, chosen topic, and message when you write to us
        through the contact page. We do not buy data about you, scrape data about you, or gather
        information from data brokers. Visiting and reading this site requires no account and no
        personal information.
      </p>

      <LegalHeading>What we never collect</LegalHeading>
      <p>
        No payment card data ever touches this site. When membership opens, payments will be
        handled by Stripe, a dedicated payment processor; your card details will go directly to
        Stripe and will never pass through or rest on our servers. We also do not ask for, and
        ask you not to send, government identification numbers or health records through any form
        on this site.
      </p>

      <LegalHeading>How we use what you share</LegalHeading>
      <p>
        We use your email address to send you the letter or invitation you asked for, and we use
        your contact messages to reply to you. That is the whole list. We do not sell personal
        information, we do not rent it, and we do not share it with advertisers. Messages sent
        about harmony conversations are read by Dr. Laiyemo and handled with particular care, as
        described on our <Link href="/legal/disclaimer">disclaimer page</Link>.
      </p>

      <LegalHeading>Video and media</LegalHeading>
      <p>
        At launch, member videos will be delivered through Mux, a professional video platform.
        Mux processes technical playback data, such as buffering and quality metrics, so films
        play smoothly. We will document that processing here, in plain language, before the first
        film streams.
      </p>

      <LegalHeading>Cookies and local storage</LegalHeading>
      <p>
        Today the site stores one thing on your device: your Dawn or Dusk theme preference, kept
        in your browser&rsquo;s local storage so the garden greets you in the light you chose. It
        never leaves your device. At launch we plan to add privacy-respecting analytics, and any
        analytics cookies will be gated behind your consent. Details live on the{" "}
        <Link href="/legal/cookies">cookies page</Link>.
      </p>

      <LegalHeading>Service providers</LegalHeading>
      <p>
        We use a small number of service providers to run the site, such as web hosting and email
        delivery, and at launch, Stripe for payments and Mux for video. Each receives only the
        information it needs to do its job, and none may use your information for its own
        purposes.
      </p>

      <LegalHeading>How long we keep information</LegalHeading>
      <p>
        We keep your email address for as long as you remain subscribed, and contact messages for
        as long as needed to help you well. When you unsubscribe or ask us to, we delete your
        information rather than archiving it indefinitely.
      </p>

      <LegalHeading>Your rights</LegalHeading>
      <p>
        Wherever you live, we honor the spirit of the strongest privacy laws, including the GDPR
        and the CCPA. You may ask us at any time to show you the information we hold about you,
        correct it, delete it, or stop using it. Write to us through the{" "}
        <Link href="/contact">contact page</Link> and we will honor your request without fuss and
        without making you prove more than we need.
      </p>

      <LegalHeading>Children</LegalHeading>
      <p>
        This site is written for adults and is not directed at children under 16. We do not
        knowingly collect personal information from children. If you believe a child has given us
        information, tell us and we will delete it.
      </p>

      <LegalHeading>Changes to this policy</LegalHeading>
      <p>
        If this policy changes in a way that matters, we will update the date at the top of this
        page and, for significant changes, tell subscribers directly by email. Questions are
        always welcome through the <Link href="/contact">contact page</Link>.
      </p>
    </LegalShell>
  );
}
