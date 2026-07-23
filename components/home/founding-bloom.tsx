import Image from "next/image";
import { NewsletterForm } from "@/components/garden/newsletter-form";
import { HorizonDraw, RevealItem } from "@/components/garden/reveal";
import { CursorGlow } from "@/components/garden/cursor-glow";

// The Founding Bloom: the conversion moment, now grounded in the dusk
// photograph: lanterns lit, the garden waiting. Deep scrim keeps AA contrast.

export function FoundingBloom({ context = "home" }: { context?: string }) {
  return (
    <section aria-labelledby="founding-title" data-ground="dark" className="relative overflow-hidden">
      <Image
        src="/images/photos/founding-dusk.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11, 31, 22,0.55) 0%, rgba(11, 31, 22,0.72) 55%, rgba(11, 31, 22,0.88) 100%)",
        }}
      />
      {/* The lantern answers the cursor here too: the conversion moment is
          the warmest ground on the page. */}
      <CursorGlow />
      {/* The conversion moment enters like every other section: the line
          draws, then the invitation blooms in sequence. */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-5 py-32 text-center text-brand-ink sm:py-44">
        <HorizonDraw className="!opacity-70 max-w-56" />
        <RevealItem index={0}>
          <h2 id="founding-title" className="text-display text-balance">
            The Garden opens soon.
          </h2>
        </RevealItem>
        <RevealItem index={1}>
          <p className="text-lede max-w-xl !text-brand-ink-muted">
            Founding members enter first: the library, the gatherings, and a seat for the person
            you love.
          </p>
        </RevealItem>
        <RevealItem index={2} className="w-full max-w-md text-left">
          <NewsletterForm
            context={context}
            tone="dark"
            successTitle="Your seat is saved."
            successBody="You will be first through the gate when the Garden opens."
          />
        </RevealItem>
        <RevealItem index={3}>
          <p className="text-[13px] text-brand-ink-muted/70">
            One letter a month, no noise. Leave whenever you like.
          </p>
        </RevealItem>
      </div>
    </section>
  );
}
