import { NewsletterForm } from "@/components/garden/newsletter-form";
import { HorizonDraw } from "@/components/garden/reveal";

// The Founding Bloom: the 11th signature experience (design ruling D7). The
// conversion moment every persona reaches, designed as a full-width dawn:
// the Horizon Line rises, one honest sentence, one field. No pricing promises;
// founding-rate policy is a client decision.

export function FoundingBloom({ context = "home" }: { context?: string }) {
  return (
    <section aria-labelledby="founding-title" className="relative overflow-hidden bg-brand">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 100%, color-mix(in srgb, var(--gold) 26%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-5 py-28 text-center text-[#F0EDE2] sm:py-36">
        <HorizonDraw className="!opacity-60 max-w-56" />
        <h2 id="founding-title" className="text-display text-balance">
          The Garden opens soon.
        </h2>
        <p className="text-lede max-w-xl !text-white/70">
          Founding members enter first: the library, the gatherings, and a seat for the person
          you love.
        </p>
        <div className="w-full max-w-md text-left">
          <NewsletterForm
            context={context}
            tone="dark"
            successTitle="Your seat is saved."
            successBody="You will be first through the gate when the Garden opens."
          />
        </div>
        <p className="text-[13px] text-white/45">
          One letter a month, no noise. Leave whenever you like.
        </p>
      </div>
    </section>
  );
}
