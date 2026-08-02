import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TierGrid } from "@/components/membership/tiers";
import { FaqList } from "@/components/membership/faq";
import { JoinBar } from "@/components/membership/join-bar";
import { DisclaimerNote } from "@/components/membership/disclaimer-note";
import { JoinPanel } from "@/components/membership/join-panel";
import { Reveal, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow, SectionHeading } from "@/components/garden/primitives";
import { BloomButton } from "@/components/garden/buttons";
import { ctaLabels } from "@/content/site";
import { consultationPricing, openingNote } from "@/content/offerings";
import { faq } from "@/content/library";

export const metadata: Metadata = {
  title: "The Inner Garden Membership",
  description:
    "Membership for individuals and families: exclusive videos not on YouTube, guides and workbooks, a free monthly webinar, and warmer rates on private harmony conversations.",
};

// /membership: the conversion page of phase 1. No Stripe this phase; every
// join CTA scrolls to the JoinPanel at #join, which decides between
// checkout, sign-in, and "enter the garden" from the session.

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
        src="/images/photos/gate-path-gold.jpg"
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(11, 31, 22,0.30) 0%, transparent 40%)",
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
                A garden grows best when it is tended.
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
                <BloomButton href="#join">{ctaLabels.join}</BloomButton>
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

      {/* 2 · Who a membership is for, above the pricing (D25) */}

      {/* 3 · Tiers */}
      <section
        aria-labelledby="tiers-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8"
      >
        <SectionHeading
          title={<span id="tiers-title">Membership is open to an individual or a family.</span>}
          lede="For individuals, couples, and families with unique email addresses. Adults, eighteen and over."
        />
        <div className="mt-12 flex flex-col gap-6">
          <TierGrid />
          <p className="mt-8 max-w-[70ch] text-[15px] leading-relaxed text-ink-muted">
            {openingNote}
          </p>
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
      <section aria-labelledby="conversation-rate-title" className="bg-brand text-brand-ink">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <Reveal>
                <h2 id="conversation-rate-title" className="text-display text-balance">
                  Conversations, warmer for members.
                </h2>
              </Reveal>
              <Reveal>
                <p className="text-lede max-w-[56ch] !text-brand-ink-muted">
                  Private harmony conversations with Dr. Laiyemo are{" "}
                  {consultationPricing.standard}.
                </p>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-4 lg:col-start-9">
              <div className="rounded-3xl border border-white/12 px-7 py-6">
                <p className="text-[15px] leading-relaxed text-brand-ink-muted">
                  {consultationPricing.memberNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* 6 · FAQ */}
      <section
        aria-labelledby="faq-title"
        className="mx-auto max-w-7xl px-5 pb-24 sm:pb-32 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                title={<span id="faq-title">Frequently Asked Questions</span>}
                lede="Everything asked before joining."
              />
            </div>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <FaqList />
          </Reveal>
        </div>
      </section>

      {/* 7 · The Founding Bloom (id="founding" is the join target, D7/D8) */}
      <div id="founding" className="scroll-mt-24">
        <JoinPanel />
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
