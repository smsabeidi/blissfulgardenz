"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctaLabels } from "@/content/site";
import { BloomButton, QuietButton } from "@/components/garden/buttons";
import { SunDisc, FarFoliage, ForegroundGrasses } from "./hero-art";

gsap.registerPlugin(ScrollTrigger);

// The Dawn Hero (DESIGN.md composition spec). Five layers, time-aware light,
// a first-visit sunrise choreography, and 8-12% capped scroll parallax.
// Precedence: manual theme beats system beats time; time-of-day tints the
// hero sky only, and only in dawn mode.

type TimeBucket = "dawn" | "gold" | "amber" | "dusk";

const TINTS: Record<TimeBucket, string> = {
  dawn: "linear-gradient(to bottom, #F4E4D8 0%, #F6E3C4 40%, #EEDCAC 66%, #F7F4EC 100%)",
  gold: "", // the SSR default frame (var(--hero-sky)); no overlay needed
  amber: "linear-gradient(to bottom, #F3E0C2 0%, #F0D6A4 42%, #E8CA90 66%, #F7F4EC 100%)",
  dusk: "linear-gradient(to bottom, #DCE0CE 0%, #E4DBB4 45%, #D9C48C 70%, #F7F4EC 100%)",
};

function bucketFor(hour: number): TimeBucket {
  if (hour >= 5 && hour < 10) return "dawn";
  if (hour >= 10 && hour < 16) return "gold";
  if (hour >= 16 && hour < 19) return "amber";
  return "dusk";
}

export function HeroDawn() {
  const root = useRef<HTMLElement>(null);
  const [tint, setTint] = useState<string>("");

  // Time-of-day light, resolved client-side after hydration, dawn theme only.
  useEffect(() => {
    if (document.documentElement.getAttribute("data-theme") === "dusk") return;
    const bucket = bucketFor(new Date().getHours());
    if (bucket !== "gold") setTint(TINTS[bucket]);
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
        gsap.set("[data-hero-reveal]", { opacity: 1, y: 0 });
        gsap.set("[data-hero-line]", { scaleX: 1 });
        return;
      }

      // Entrance: the sunrise choreography on first visit (1.2s), a brief
      // welcome fade on return visits. Motivation: storytelling; the brand
      // promise (a horizon at first light) performed once, then never nagging.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (firstVisit) {
        tl.fromTo("[data-hero-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.5 })
          .fromTo("[data-hero-sun]", { y: 40 }, { y: 0, duration: 0.6 }, "-=0.25")
          .fromTo(
            "[data-hero-reveal]",
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.09 },
            "-=0.3"
          );
      } else {
        gsap.set("[data-hero-line]", { scaleX: 1 });
        tl.fromTo(
          "[data-hero-reveal]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }
        );
      }

      // Parallax: far foliage 8%, foreground grasses 12% (caps per PRD §5.3).
      gsap.to("[data-hero-far]", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-near]", {
        yPercent: 12,
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
    >
      {/* L1 sky: SSR default frame + time tint crossfade layer */}
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--hero-sky)" }} />
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ background: tint || "transparent", opacity: tint ? 1 : 0 }}
      />

      {/* L2 sun on the horizon (the motif's origin), below the content block */}
      <div aria-hidden className="absolute left-1/2 top-[64%] h-[130px] w-[240px] -translate-x-1/2 -translate-y-full">
        <SunDisc />
      </div>
      <div
        data-hero-line
        aria-hidden
        className="absolute left-[6%] right-[6%] top-[64%] h-px origin-left bg-gold opacity-80"
      />

      {/* L3 distant foliage */}
      <div data-hero-far aria-hidden className="absolute inset-x-0 bottom-[104px] h-[190px] sm:bottom-[120px]">
        <FarFoliage />
      </div>

      {/* L4 foreground grasses */}
      <div data-hero-near aria-hidden className="absolute inset-x-0 -bottom-1 h-[220px]">
        <ForegroundGrasses />
      </div>

      {/* L5 content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-5 pt-[22dvh] text-center lg:px-8">
        <h1 data-hero-reveal className="text-display-xl max-w-5xl text-balance">
          Harmony on the horizon.
        </h1>
        <p data-hero-reveal className="text-lede mt-6 max-w-xl text-balance">
          A garden of bliss for people who believe enduring, healthy relationships are worth
          tending.
        </p>
        <div data-hero-reveal className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <BloomButton href="/membership">{ctaLabels.membership}</BloomButton>
          <QuietButton href="/about/dr-laiyemo">{ctaLabels.meetFounder}</QuietButton>
        </div>
      </div>
    </section>
  );
}
