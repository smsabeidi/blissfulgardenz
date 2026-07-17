import type { Metadata } from "next";
import { BloomButton } from "@/components/garden/buttons";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow } from "@/components/garden/primitives";
import { DisclaimerNote } from "@/components/conversations/disclaimer-note";
import { ConversationPhotoBand } from "@/components/conversations/photo-band";
import { conversationSteps, consultationPricing } from "@/content/offerings";
import { ctaLabels } from "@/content/site";

export const metadata: Metadata = {
  title: "How Conversations Work",
  description:
    "Four gentle steps from a first note to follow-up: how a private harmony conversation with Dr. Laiyemo works, what it costs, and how to begin today.",
};

// The four steps at full depth: each step is a section-row with its own short
// paragraph. Then fees, the reschedule line, the privacy promise, and the
// honest booking panel (booking opens with the platform launch; today the
// path is the contact form).

const stepNotes = [
  "There is no wrong way to begin. A sentence or two is plenty, and you set the pace from the very first word.",
  "A few gentle questions: where you are, and what you hope for. They exist so the hour is spent on you.",
  "Come together or alone, by video or in person. There is no script: the conversation goes where you need it to go.",
  "You leave with more than a memory: notes on what you agreed, and readings chosen for where you are.",
] as const;

export default function HowItWorksPage() {
  return (
    <>
      {/* 1 · Opening: the chairs band, title over the duotone */}
      <section aria-labelledby="how-title">
        <ConversationPhotoBand
          titleId="how-title"
          title="Four steps, taken gently"
          kicker={<Eyebrow tone="dark">How it works</Eyebrow>}
        />
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:px-8">
          <Reveal>
            <p className="text-lede max-w-[58ch]">
              From a first note to a follow-up made for you. Here is the whole path, with nothing
              hidden.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 · The four steps, each a section-row */}
      <section aria-label="The four steps" className="mx-auto max-w-7xl px-5 pb-24 sm:pb-32 lg:px-8">
        <ol role="list" className="flex flex-col">
          {conversationSteps.map((step, i) => (
            <li key={step.title} className="border-t border-hairline">
              <RevealItem index={0}>
                <div className="grid grid-cols-1 gap-4 py-12 sm:py-16 md:grid-cols-12 md:gap-8">
                  <span
                    aria-hidden
                    className="font-[family-name:var(--font-display)] text-display text-gold-text md:col-span-2"
                  >
                    {i + 1}
                  </span>
                  <h2 className="text-display-sm md:col-span-4 md:pt-2">{step.title}</h2>
                  <div className="flex flex-col gap-4 md:col-span-6 md:pt-2">
                    <p className="text-body text-ink-muted">{step.body}</p>
                    <p className="text-body text-ink-muted">{stepNotes[i]}</p>
                  </div>
                </div>
              </RevealItem>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 · What a conversation costs */}
      <section aria-labelledby="cost-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-28 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <h2 id="cost-title" className="text-display text-balance">
                  What a conversation costs
                </h2>
              </Reveal>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="text-display-sm">{consultationPricing.standard}</p>
              </Reveal>
              <Reveal>
                <p className="text-body text-ink-muted">{consultationPricing.memberNote}</p>
              </Reveal>
              <Reveal>
                <p className="border-t border-hairline pt-4 text-[15px] text-ink-muted">
                  Reschedule or cancel up to 24 hours ahead.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · The privacy promise */}
      <section aria-labelledby="privacy-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-28 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <Reveal>
            <HorizonDraw className="max-w-24" />
          </Reveal>
          <Reveal>
            <h2 id="privacy-title" className="text-display text-balance">
              Private, from the first note
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-lede max-w-[58ch]">
              Your intake is read only by Dr. Laiyemo, and what you share stays between you, from
              the first note to the follow-up.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5 · Booking panel: honest about today's path */}
      <section aria-labelledby="begin-title" className="relative overflow-hidden bg-brand">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 100%, color-mix(in srgb, var(--gold) 22%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-5 py-24 text-center text-[#F0EDE2] sm:py-32">
          <HorizonDraw className="max-w-56 !opacity-60" />
          <Reveal>
            <h2 id="begin-title" className="text-display text-balance">
              Ready when you are
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-lede max-w-xl !text-white/70">
              Online booking opens with the platform launch. Today, the path begins with a short
              note through the contact page.
            </p>
          </Reveal>
          <Reveal>
            <BloomButton
              href="/contact?topic=conversation"
              className="!bg-[#D8B23A] !text-[#0B1512]"
            >
              {ctaLabels.bookConversation}
            </BloomButton>
          </Reveal>
          <Reveal>
            <p className="text-[13px] text-white/45">
              Share only what you are comfortable sharing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 6 · Disclaimer footnote */}
      <section aria-label="Disclaimer" className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:pb-32 sm:pt-20 lg:px-8">
        <Reveal>
          <DisclaimerNote crisis className="mx-auto max-w-3xl" />
        </Reveal>
      </section>
    </>
  );
}
