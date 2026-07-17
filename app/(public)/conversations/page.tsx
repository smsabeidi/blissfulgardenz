import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BloomButton } from "@/components/garden/buttons";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow, SectionHeading, PetalCard } from "@/components/garden/primitives";
import { ConversationTimeline } from "@/components/conversations/conversation-timeline";
import { DisclaimerNote } from "@/components/conversations/disclaimer-note";
import { offerings, conversationSteps, consultationPricing, pillars } from "@/content/offerings";
import { ctaLabels } from "@/content/site";

export const metadata: Metadata = {
  title: "Harmony Conversations",
  description:
    "Private, unhurried 60-minute conversations with Dr. Laiyemo: premarital, marital, and rebuilding paths, rooted in the five pillars of a healthy relationship.",
};

// Conversations hub: philosophy opening split with the chairs photograph (two
// chairs facing each other: the brand's conversation image and the book-one
// cover motif), the asymmetric three-paths band (same idiom as Home: two
// prominent PetalCards, Rebuilding as a quieter full-width row), the four-step
// timeline on a drawn gold connector, the confidentiality promise, calm fees,
// and the quiet disclaimer footnote.

export default function ConversationsPage() {
  const pillarNames = pillars.map((p) => p.name.toLowerCase());
  const pillarLine = `${pillarNames.slice(0, -1).join(", ")}, and ${pillarNames[pillarNames.length - 1]}`;
  const prominent = offerings.filter((o) => !o.quiet);
  const quietPath = offerings.find((o) => o.quiet);

  return (
    <>
      {/* 1 · Philosophy opening: text beside the chairs photograph in a
          duotone-lite frame (full color, a whisper of scrim, gold hairline) */}
      <section
        aria-labelledby="conversations-hub-title"
        className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:pb-24 sm:pt-32 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="flex max-w-3xl flex-col gap-6 lg:col-span-6">
            <Reveal>
              <Eyebrow>Harmony conversations</Eyebrow>
            </Reveal>
            <Reveal>
              <h1 id="conversations-hub-title" className="text-display-xl text-balance">
                A safe place to say it out loud
              </h1>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[58ch]">
                Sixty unhurried minutes with Dr. Laiyemo. Private, practical, and rooted in the five
                pillars every healthy relationship stands on.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-body max-w-[58ch] text-ink-muted">
                {`${pillarLine.charAt(0).toUpperCase()}${pillarLine.slice(1)}: whatever brings you, the conversation tends the whole garden.`}
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5 lg:col-start-8">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-[color-mix(in_srgb,var(--gold)_45%,transparent)]"
              style={{ boxShadow: "0 18px 50px var(--shadow-tint)" }}
            >
              <Image
                src="/images/photos/chairs.jpg"
                alt="Two wicker chairs facing each other in a private garden at golden hour"
                fill
                sizes="(max-width: 1023px) 92vw, 34vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11, 21, 18, 0.26) 0%, rgba(11, 21, 18, 0) 45%)",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 · Three paths: the asymmetric band (never three equal cards) */}
      <section aria-labelledby="paths-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <Reveal>
            <SectionHeading
              title={<span id="paths-title">Three paths into the garden</span>}
              lede="Choose the season that sounds like yours. Every path is private, and every path starts the same gentle way."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {prominent.map((offering, i) => (
              <RevealItem key={offering.slug} index={i} className="lg:col-span-6">
                <Link href={`/conversations/${offering.slug}`} className="group block h-full">
                  <PetalCard className="h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transition-none">
                    <div className="flex h-full flex-col gap-4">
                      <p className="text-meta text-gold-text">{offering.label}</p>
                      <p className="text-display-sm">{offering.title}</p>
                      <p className="text-body text-ink-muted">{offering.lede}</p>
                      <p className="flex-1 text-[14px] text-ink-muted">For {offering.audience.charAt(0).toLowerCase()}{offering.audience.slice(1)}.</p>
                      <span className="text-[15px] font-medium text-gold-text">
                        Learn more
                        <span
                          aria-hidden
                          className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                        >
                          &rarr;
                        </span>
                      </span>
                    </div>
                  </PetalCard>
                </Link>
              </RevealItem>
            ))}
            {quietPath ? (
              <RevealItem index={2} className="lg:col-span-12">
                <Link
                  href={`/conversations/${quietPath.slug}`}
                  className="group flex flex-col gap-2 rounded-[2rem] border border-hairline px-8 py-7 transition-colors duration-300 hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-meta text-gold-text">{quietPath.label}</p>
                    <p className="text-display-sm">{quietPath.title}</p>
                    <p className="text-[15px] text-ink-muted">
                      For {quietPath.audience.charAt(0).toLowerCase()}{quietPath.audience.slice(1)}.
                    </p>
                  </div>
                  <span className="shrink-0 text-[15px] font-medium text-gold-text">
                    A quieter way in
                    <span
                      aria-hidden
                      className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ) : null}
          </div>
        </div>
      </section>

      {/* 3 · What a conversation looks like: the four steps on one drawn line */}
      <section aria-labelledby="steps-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Reveal>
              <h2 id="steps-title" className="text-display text-balance">
                What a conversation looks like
              </h2>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[40ch]">
                Four small steps, taken at your pace, from a first note to a follow-up made for
                you.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ConversationTimeline steps={conversationSteps} />
          </div>
        </div>
      </section>

      {/* 4 · Confidentiality promise */}
      <section aria-labelledby="confidence-title" className="bg-brand text-[#F0EDE2]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="flex flex-col gap-5 lg:col-span-5">
              <Reveal>
                <HorizonDraw className="max-w-24 !opacity-60" />
              </Reveal>
              <Reveal>
                <h2 id="confidence-title" className="text-display text-balance">
                  Held in confidence
                </h2>
              </Reveal>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="text-lede !text-white/75">
                  Your intake is read only by Dr. Laiyemo, and what you share in the hour stays
                  between you.
                </p>
              </Reveal>
              <Reveal>
                <p className="text-body max-w-[56ch] !text-white/60">
                  Come together or alone. Many people begin alone, especially in strained seasons,
                  and are welcome exactly as they are.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Fees, presented calmly (the page's one centered section) */}
      <section aria-labelledby="fees-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <Reveal>
            <h2 id="fees-title" className="text-display text-balance">
              What a conversation costs
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-display-sm text-balance">{consultationPricing.standard}</p>
          </Reveal>
          <Reveal>
            <p className="text-[15px] text-ink-muted">{consultationPricing.memberNote}</p>
          </Reveal>
          <Reveal>
            <div className="mt-4">
              <BloomButton href="/conversations/how-it-works">
                {ctaLabels.bookConversation}
              </BloomButton>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-[14px] text-ink-muted">
              See the four steps and how booking works today.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 6 · Disclaimer footnote */}
      <section aria-label="Disclaimer" className="mx-auto max-w-7xl px-5 pb-24 sm:pb-32 lg:px-8">
        <Reveal>
          <DisclaimerNote crisis className="mx-auto max-w-3xl" />
        </Reveal>
      </section>
    </>
  );
}
