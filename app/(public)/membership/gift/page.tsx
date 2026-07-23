import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/garden/newsletter-form";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { SectionHeading } from "@/components/garden/primitives";
import { QuietButton } from "@/components/garden/buttons";
import { ctaLabels } from "@/content/site";

export const metadata: Metadata = {
  title: "The Wedding Gift of Harmony",
  description:
    "Give the Inner Garden as a wedding gift: three, six, or twelve month memberships with scheduled delivery and a printable certificate. Gifting opens with the platform.",
};

// /membership/gift: a landing for gift-givers (P4: parents, mentors,
// officiants). Honest status: nothing is for sale today; gifting opens with
// the platform. The capture is the gift-interest list (ctaLabels.giftCapture).

const steps = [
  {
    numeral: "1",
    title: "Choose a season",
    body: "Three, six, or twelve months inside the Inner Garden, sized to the couple and the occasion.",
  },
  {
    numeral: "2",
    title: "Send it beautifully",
    body: "Scheduled delivery for the wedding day, with a designed certificate you can print and place in their hands.",
  },
  {
    numeral: "3",
    title: "They begin when ready",
    body: "A honeymoon-safe redemption window: the gift waits quietly until the couple is home and settled.",
  },
] as const;

export default function GiftPage() {
  return (
    <>
      {/* 1 · Full-bleed bouquet opening: the gift itself, photographed. A wide
          cinematic crop via fixed-height container; the title sits bottom-left
          on a rising scrim (the home-hero type idiom). */}
      <section
        aria-labelledby="gift-title"
        className="relative flex h-[56vh] max-h-[640px] min-h-[420px] flex-col overflow-hidden"
      >
        <Image
          src="/images/photos/bouquet.jpg"
          alt="A wedding bouquet of garden flowers resting on linen"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Depth floor: title over photo always sits on a scrim (DESIGN.md) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11, 31, 22,0.70) 0%, rgba(11, 31, 22,0.24) 45%, transparent 70%), linear-gradient(to bottom, rgba(11, 31, 22,0.30) 0%, transparent 30%)",
          }}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-14 pt-32 lg:px-8">
          <Reveal>
            <p className="text-meta mb-6 text-brand-ink [text-shadow:0_1px_12px_rgba(11, 31, 22,0.5)]">
              Gift membership
            </p>
          </Reveal>
          <Reveal>
            <h1
              id="gift-title"
              className="text-display-xl max-w-4xl text-balance text-[#FBF4EA] [text-shadow:0_2px_24px_rgba(11, 31, 22,0.55)]"
            >
              The Wedding Gift of Harmony
            </h1>
          </Reveal>
        </div>
      </section>

      {/* 1b · The gift-giver lede, on the canvas below the photograph */}
      <section
        aria-label="Who the gift is for"
        className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:pb-28 sm:pt-20 lg:px-8"
      >
        <div className="flex max-w-5xl flex-col items-start gap-7">
          <Reveal>
            <p className="text-lede max-w-[60ch]">
              For parents, mentors, and officiants: a season inside the Inner Garden, given to a
              couple you love at the very start.
            </p>
          </Reveal>
          <HorizonDraw className="max-w-48" />
          <Reveal>
            <p className="text-body max-w-[55ch] text-ink-muted">
              Toasters are forgotten. A shared language for the hard topics is not.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 · How it will work at launch: a three-step band, not three cards */}
      <section aria-labelledby="gift-steps-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <SectionHeading
            title={<span id="gift-steps-title">How it will work at launch</span>}
          />
          <ol className="mt-14 grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-y-0">
            {steps.map((step, i) => (
              <li
                key={step.numeral}
                className={`${i > 0 ? "border-t border-hairline pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0" : ""} ${
                  i === 1 ? "lg:mt-10" : i === 2 ? "lg:mt-20" : ""
                }`}
              >
                <RevealItem index={i} className="flex h-full flex-col gap-4 lg:pr-10">
                  <span
                    aria-hidden
                    className="block font-[family-name:var(--font-display)] text-5xl leading-none text-gold-text/70"
                  >
                    {step.numeral}
                  </span>
                  <h3 className="text-display-sm">{step.title}</h3>
                  <p className="text-body text-ink-muted">{step.body}</p>
                </RevealItem>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 · Honest status + the gift-interest capture */}
      <section aria-labelledby="gift-capture-title" className="relative overflow-hidden bg-brand">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 100%, color-mix(in srgb, var(--gold) 22%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-5 py-24 text-center text-brand-ink sm:py-32">
          <HorizonDraw className="max-w-56 !opacity-60" />
          <h2 id="gift-capture-title" className="text-display text-balance">
            Gifting opens with the platform.
          </h2>
          <p className="text-lede max-w-xl !text-brand-ink-muted">
            Nothing is for sale today. Leave your address and the first invitation to give the
            Garden will be yours.
          </p>
          <div className="w-full max-w-md text-left">
            <NewsletterForm
              context="gift"
              tone="dark"
              buttonLabel={ctaLabels.giftCapture}
              successTitle="You will be first."
              successBody="When gifting opens, the first invitation goes to you."
            />
          </div>
          <p className="text-[13px] text-brand-ink-muted/60">
            One letter a month, no noise. Leave whenever you like.
          </p>
        </div>
      </section>

      {/* 4 · Cross-link back to membership */}
      <section aria-label="See the membership" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-[2rem] border border-hairline px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-display-sm">See what they will receive.</p>
              <p className="max-w-[52ch] text-[15px] text-ink-muted">
                The full tour of the Inner Garden: tiers, the Couple Seat, and the library the two
                of them will share.
              </p>
            </div>
            <QuietButton href="/membership" className="shrink-0">
              {ctaLabels.membership}
            </QuietButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
