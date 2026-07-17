import Image from "next/image";
import { NewsletterForm } from "@/components/garden/newsletter-form";
import { HorizonDraw } from "@/components/garden/reveal";

// The Founding Bloom: the conversion moment, now grounded in the dusk
// photograph: lanterns lit, the garden waiting. Deep scrim keeps AA contrast.

export function FoundingBloom({ context = "home" }: { context?: string }) {
  return (
    <section aria-labelledby="founding-title" className="relative overflow-hidden">
      <Image
        src="/images/photos/hero-dusk.jpg"
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
            "linear-gradient(to bottom, rgba(11,21,18,0.55) 0%, rgba(11,21,18,0.72) 55%, rgba(11,21,18,0.88) 100%)",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 px-5 py-32 text-center text-[#F0EDE2] sm:py-44">
        <HorizonDraw className="!opacity-70 max-w-56" />
        <h2 id="founding-title" className="text-display text-balance">
          The Garden opens soon.
        </h2>
        <p className="text-lede max-w-xl !text-white/75">
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
        <p className="text-[13px] text-white/50">
          One letter a month, no noise. Leave whenever you like.
        </p>
      </div>
    </section>
  );
}
