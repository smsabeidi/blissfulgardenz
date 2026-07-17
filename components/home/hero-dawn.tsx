"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctaLabels } from "@/content/site";
import { BloomButton, QuietButton } from "@/components/garden/buttons";

gsap.registerPlugin(ScrollTrigger);

// The Golden Hour hero (reference: casadisolare.com). One monumental idea:
// an enormous butter-gold sun resting on the horizon of a warm plum sky,
// the brand motto set at wordmark scale above it with a same-family italic
// accent. The sun rises gently as you scroll (parallax scrub, no pinning,
// no hijack: comfort over spectacle). First visit: the sun breathes up and
// the type settles out of a soft blur. Reduced motion: a still dawn.

export function HeroDawn() {
  const root = useRef<HTMLElement>(null);

  // The hero ground is plum in both themes: tell the header to run its
  // over-dark treatment while it sits on top of this scene.
  useEffect(() => {
    document.body.dataset.darkhero = "1";
    return () => {
      delete document.body.dataset.darkhero;
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current) return;

    let firstVisit = false;
    try {
      firstVisit = !localStorage.getItem("bg-visited");
      localStorage.setItem("bg-visited", "1");
    } catch {
      firstVisit = false;
    }

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-hero-reveal]", { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set("[data-hero-sun]", { yPercent: 0 });
        return;
      }

      // If anything interrupts the choreography (dev HMR, a dropped frame on
      // a throttled tab), the copy must still land visible.
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onInterrupt: () => gsap.set("[data-hero-reveal]", { opacity: 1, y: 0, filter: "blur(0px)" }),
      });
      if (firstVisit) {
        tl.fromTo("[data-hero-sun]", { yPercent: 16 }, { yPercent: 0, duration: 1.6, ease: "power2.out" })
          .fromTo(
            "[data-hero-reveal]",
            { opacity: 0, y: 26, filter: "blur(10px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.12 },
            "-=1.0"
          );
      } else {
        tl.fromTo(
          "[data-hero-reveal]",
          { opacity: 0, y: 14, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.07 }
        );
      }

      // The sun keeps rising as you leave the hero: it moves against the
      // scroll so the horizon feels alive without hijacking the page.
      gsap.to("[data-hero-sun]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: 8,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Welcome"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
      style={{ background: "var(--hero-sky)" }}
    >
      {/* The sun: one enormous, softly glowing sphere on the horizon */}
      <div
        data-hero-sun
        aria-hidden
        className="absolute bottom-[-52vmin] left-1/2 h-[104vmin] w-[104vmin] -translate-x-1/2 rounded-full will-change-transform"
        style={{
          background: "var(--sun)",
          boxShadow:
            "0 0 120px 30px color-mix(in srgb, var(--gold) 45%, transparent), 0 0 300px 80px color-mix(in srgb, var(--gold) 18%, transparent)",
        }}
      />

      {/* The horizon: one gold line the sun rises behind */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gold opacity-60" />

      {/* Wordmark-scale motto; CTAs live with the copy so the lower half
          belongs entirely to the sun */}
      <div
        data-hero-copy
        className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col items-center gap-9 px-5 pt-28 text-center lg:px-8"
      >
        <p data-hero-reveal className="text-meta text-[#F5EBDD]/80">
          A garden of bliss for the people
        </p>
        <h1
          data-hero-reveal
          className="font-[family-name:var(--font-display)] text-balance text-[clamp(3.4rem,11vw,10.5rem)] font-[440] leading-[0.94] tracking-[-0.045em] text-[#F8EFE2]"
        >
          Harmony <em className="font-[420] italic text-[#F2DCA6]">on the</em> horizon.
        </h1>
        <p data-hero-reveal className="text-lede max-w-xl text-balance !text-[#EBDCC8]">
          Enduring, healthy relationships are grown on purpose. This is where they are
          tended.
        </p>
      </div>

      {/* CTAs rest on the sun itself (the Solare floating-pill move): plum
          on butter, always in front of the disc at the section's foot */}
      <div
        data-hero-reveal
        className="absolute inset-x-0 bottom-[7dvh] z-10 flex flex-col items-center justify-center gap-4 px-5 sm:flex-row"
      >
        <BloomButton href="/membership">{ctaLabels.membership}</BloomButton>
        <QuietButton
          href="/about/dr-laiyemo"
          className="!border-[#3A2A2D]/40 !text-[#3A2A2D] hover:!bg-[#3A2A2D]/10"
        >
          {ctaLabels.meetFounder}
        </QuietButton>
      </div>
    </section>
  );
}
