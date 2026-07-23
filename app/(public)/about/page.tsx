import type { Metadata } from "next";
import Image from "next/image";
import { StoryPath } from "@/components/about/story-path";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow, SectionHeading } from "@/components/garden/primitives";
import { BloomButton, QuietButton } from "@/components/garden/buttons";
import { brand, ctaLabels, disclaimer } from "@/content/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How thirty-five years of medicine, two decades of family-harmony advocacy, and the Three Guys Talking trilogy grew into Blissful Gardenz.",
};

// Our Story (PRD §7.2): a display-quote mission, the Story Path scroll journey,
// a values statement, and a two-CTA close. Four sections, one eyebrow (ration),
// one centered section at a time.

const values = [
  {
    name: "Harmony is tended, not found.",
    line: "Strong marriages are grown on purpose, season after season, with tools worth keeping.",
  },
  {
    name: "Every season deserves dignity.",
    line: "Engaged, long married, or rebuilding quietly: every couple is met with warmth and without judgment.",
  },
  {
    name: "The garden belongs to both of you.",
    line: "Nothing here asks one partner to carry the work alone. Two seats, one horizon.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* 1 · Arrival: a low photographic band (first light over the hedges),
          then the mission spoken plainly beneath it. The only text on the
          photo is the section eyebrow, seated on the bottom scrim. */}
      <section aria-labelledby="mission-title" className="pb-24 sm:pb-32">
        <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
          <Image
            src="/images/photos/hero-dawn.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="photo-warm object-cover"
          />
          {/* Depth floor: the eyebrow sits on this scrim, AA in both themes. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(11, 31, 22,0.78) 0%, rgba(11, 31, 22,0.30) 42%, rgba(11, 31, 22,0) 70%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-7xl px-5 pb-6 lg:px-8">
              <Eyebrow tone="dark">Our story</Eyebrow>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 pt-16 sm:pt-24 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <Reveal>
              <h1 id="mission-title" className="text-display-xl text-balance">
                {brand.mission}.
              </h1>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-2xl text-balance">{brand.description}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 · The Story Path: four milestones on the Horizon Line */}
      <section
        aria-labelledby="path-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8"
      >
        <SectionHeading
          title={<span id="path-title">The path to this garden</span>}
          lede="Four seasons of one life's work, each preparing the ground for the next."
        />
        <div className="mt-16 sm:mt-20">
          <StoryPath />
        </div>
      </section>

      {/* 3 · Values: asymmetric split, heading left, commitments right */}
      <section aria-labelledby="values-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <HorizonDraw className="mb-14" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                title={<span id="values-title">What the garden believes</span>}
                lede="Three commitments, kept in every season."
              />
            </div>
            <div className="divide-y divide-hairline lg:col-span-6 lg:col-start-7">
              {values.map((value, i) => (
                <RevealItem key={value.name} index={i}>
                  <div className="flex flex-col gap-2 py-7 first:pt-0 last:pb-0">
                    <h3 className="text-display-sm">{value.name}</h3>
                    <p className="text-body max-w-[52ch] text-ink-muted">{value.line}</p>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 · The close: two doors into the garden, under the leaf at first
          light. Duotone treatment from the poster technique: brand ground +
          luminosity-blended photo at low opacity + scrim for the text floor. */}
      <section aria-labelledby="walk-title" className="relative overflow-hidden bg-brand">
        <Image
          src="/images/photos/leaf-macro.jpg"
          alt=""
          fill
          sizes="100vw"
          className="photo-warm object-cover opacity-25 mix-blend-luminosity"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11, 31, 22,0.50) 0%, rgba(11, 31, 22,0.66) 55%, rgba(11, 31, 22,0.82) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:py-36 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center text-brand-ink">
            <Reveal>
              <h2 id="walk-title" className="text-display text-balance">
                Walk with us.
              </h2>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-xl text-balance !text-brand-ink-muted">
                Begin as a member of the Inner Garden, or begin with one unhurried conversation.
              </p>
            </Reveal>
            <Reveal>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <BloomButton href="/membership" tone="gold">
                  {ctaLabels.membership}
                </BloomButton>
                <QuietButton
                  href="/conversations/how-it-works"
                  className="!border-white/25 !text-brand-ink hover:!bg-white/10"
                >
                  {ctaLabels.bookConversation}
                </QuietButton>
              </div>
            </Reveal>
            <Reveal className="w-full">
              <div className="mt-4 rounded-2xl border border-white/15 bg-[#0f2e22]/30 px-6 py-5 text-left">
                <p className="text-[14px] leading-relaxed text-brand-ink-muted">{disclaimer.short}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
