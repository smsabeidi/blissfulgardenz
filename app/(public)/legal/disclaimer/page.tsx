import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalHeading } from "@/components/legal/legal-shell";
import { PetalCard } from "@/components/garden/primitives";
import { brand, disclaimer } from "@/content/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "What harmony conversations are, what they are not, and where to turn in a crisis. Plain words about the limits of what we offer.",
};

export default function DisclaimerPage() {
  return (
    <LegalShell
      title="Disclaimer"
      intro={
        <div className="mt-10">
          <PetalCard>
            <div className="flex flex-col gap-4">
              <p className="text-body font-medium">{disclaimer.short}</p>
              <p className="text-body text-ink-muted">{disclaimer.crisis}</p>
            </div>
          </PetalCard>
        </div>
      }
    >
      <p>
        Blissful Gardenz exists to help families flourish, and part of caring for you well is
        being plain about what we are and what we are not. Please read this page before booking a
        harmony conversation or leaning on any resource here during a hard season.
      </p>

      <LegalHeading>Educational and supportive, by design</LegalHeading>
      <p>
        Everything offered by {brand.legalName}, including the articles, books, films, guides,
        gatherings, and private harmony conversations, is educational and supportive in nature.
        These resources share perspective, structure, and encouragement drawn from
        Dr. Laiyemo&rsquo;s decades of family-harmony advocacy. They are offered to help you and
        the people you love talk well and choose wisely.
      </p>

      <LegalHeading>What harmony conversations are not</LegalHeading>
      <p>
        Harmony conversations are not medical care, psychotherapy, or licensed counseling, and
        nothing on this site is a substitute for any of those. Dr. Laiyemo is a physician, but a
        harmony conversation does not create a physician relationship, does not assess or address
        any medical or mental health condition, and does not produce medical advice. If you are
        working with a licensed professional, harmony conversations can sit alongside that work,
        never in place of it.
      </p>

      <LegalHeading>Not an emergency service</LegalHeading>
      <p>
        This site and its conversations are not an emergency service and are not monitored around
        the clock. If you or someone you love is in immediate danger, call 911 (US) or your local
        emergency number. If you are in crisis or need someone to talk to right now, call or text
        988 (US) to reach trained support, any hour of any day.
      </p>

      <LegalHeading>When to seek licensed help</LegalHeading>
      <p>
        Some seasons need more than encouragement and a good framework. If you are experiencing
        abuse, thoughts of harming yourself or others, or distress that will not lift, please
        reach a licensed professional in your area. Doing so is not a failure of your marriage or
        your faith in it. It is one more way of tending what you love.
      </p>

      <LegalHeading>Your decisions remain yours</LegalHeading>
      <p>
        The stories and examples in our books, articles, and films are shared to illuminate, not
        to prescribe. Every marriage is its own garden. What you plant, keep, or change is always
        your decision, and we trust you with it. If anything on this page is unclear, ask us
        through the <Link href="/contact">contact page</Link> and a person will answer.
      </p>
    </LegalShell>
  );
}
