import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CoupleSeatBand } from "@/components/membership/couple-seat";
import { VisitorRow, TierGrid } from "@/components/membership/tiers";
import { FaqList } from "@/components/membership/faq";
import { JoinBar } from "@/components/membership/join-bar";
import { DisclaimerNote } from "@/components/membership/disclaimer-note";
import { BlossomWall } from "@/components/home/blossom-wall";
import { FoundingBloom } from "@/components/home/founding-bloom";
import { Reveal, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow, SectionHeading } from "@/components/garden/primitives";
import { BloomButton } from "@/components/garden/buttons";
import { ctaLabels } from "@/content/site";
import { consultationPricing } from "@/content/offerings";
import { faq } from "@/content/library";

export const metadata: Metadata = {
  title: "The Inner Garden Membership",
  description:
    "Membership for couples and individuals: the film library, guides and workbooks, a live monthly gathering, and the Couple Seat. Two logins, one price. Founding list open.",
};

// /membership: the conversion page of phase 1. No Stripe this phase; every
// join CTA is the founding list, scrolling to #founding (rulings D7/D8).

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}).replace(/</g, "\\u003c");

// The threshold photograph, near-full color like the conversations chairs
// (the golden light through the gate IS the point), with a quiet depth floor
// and the gold hairline ring. Decorative, so alt="".
function GatePhoto({ className, sizes }: { className: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden ring-1 ring-gold/45 ${className}`}>
      <Image
        src="/images/photos/gate-path.jpg"
        alt=""
        fill
        sizes={sizes}
        className="photo-warm object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(37,26,29,0.30) 0%, transparent 40%)",
        }}
      />
    </div>
  );
}

export default function MembershipPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      {/* 1 · Emotional opening: editorial split. The open gate onto the sunlit
          path is the threshold metaphor: membership as stepping through.
          Desktop: tall duotone frame right; below lg it becomes a 16:9 band. */}
      <section
        aria-labelledby="membership-title"
        className="mx-auto max-w-7xl px-5 pb-24 pt-40 sm:pb-28 sm:pt-48 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="flex flex-col items-start gap-7 lg:col-span-7">
            <Reveal>
              <Eyebrow>The Inner Garden</Eyebrow>
            </Reveal>
            <Reveal>
              <h1 id="membership-title" className="text-display-xl text-balance">
                A garden grows best when it is tended weekly.
              </h1>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[60ch]">
                The Inner Garden is the membership: the film library, guides and workbooks, a
                monthly live gathering, and warm rates on private conversations.
              </p>
            </Reveal>
            <HorizonDraw className="max-w-48" />
            <Reveal>
              <div className="flex flex-wrap items-center gap-6">
                <BloomButton href="#founding">{ctaLabels.foundingList}</BloomButton>
                <Link
                  href="/membership/gift"
                  className="text-[15px] font-medium text-gold-text underline-offset-4 hover:underline"
                >
                  Or give it as a wedding gift
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <GatePhoto
              className="aspect-[3/4] rounded-[2rem]"
              sizes="(min-width: 1024px) 400px, 92vw"
            />
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:hidden">
          <GatePhoto className="aspect-video rounded-3xl" sizes="(max-width: 1023px) 92vw, 680px" />
        </Reveal>
      </section>

      {/* 2 · Couple Seat: the emotional frame, above the pricing (D25) */}
      <CoupleSeatBand />

      {/* 3 · Tiers */}
      <section
        aria-labelledby="tiers-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8"
      >
        <Reveal>
          <SectionHeading
            title={<span id="tiers-title">Choose how you will tend it.</span>}
            lede="Both tiers include the Couple Seat. Founding members enter first when the Garden opens."
          />
        </Reveal>
        <div className="mt-12 flex flex-col gap-6">
          <VisitorRow />
          <TierGrid />
        </div>
        <Reveal>
          <p className="mt-14 text-center text-[15px] text-ink-muted">
            Cancel anytime. No dark patterns. The gate opens outward.
          </p>
        </Reveal>
      </section>

      {/* Sentinel + sticky join bar: appears once the tiers scroll past */}
      <JoinBar />

      {/* 4 · Conversations benefit strip */}
      <section aria-labelledby="conversation-rate-title" className="bg-brand text-[#F3E9DE]">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <Reveal>
                <h2 id="conversation-rate-title" className="text-display text-balance">
                  Conversations, warmer for members.
                </h2>
              </Reveal>
              <Reveal>
                <p className="text-lede max-w-[56ch] !text-white/70">
                  Private harmony conversations with Dr. Laiyemo are{" "}
                  {consultationPricing.standard}.
                </p>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-4 lg:col-start-9">
              <div className="rounded-3xl border border-white/12 px-7 py-6">
                <p className="text-[15px] leading-relaxed text-white/80">
                  {consultationPricing.memberNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5 · Member stories */}
      <section aria-label="Member stories" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <BlossomWall />
      </section>

      {/* 6 · FAQ */}
      <section
        aria-labelledby="faq-title"
        className="mx-auto max-w-7xl px-5 pb-24 sm:pb-32 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-28">
              <SectionHeading
                title={<span id="faq-title">Questions, answered gently.</span>}
                lede="Everything couples ask before they join."
              />
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <FaqList />
          </Reveal>
        </div>
      </section>

      {/* 7 · The Founding Bloom (id="founding" is the join target, D7/D8) */}
      <div id="founding" className="scroll-mt-24">
        <FoundingBloom context="membership" />
      </div>

      {/* 8 · Quiet disclaimer at the foot */}
      <section aria-label="A gentle note" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <DisclaimerNote />
        </div>
      </section>
    </>
  );
}
