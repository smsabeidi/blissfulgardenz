"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pillars } from "@/content/offerings";

gsap.registerPlugin(ScrollTrigger);

// Five Pillars as stations along the Horizon Line itself (design ruling D23):
// one golden strand crosses the section, each pillar is a point that blooms as
// the line reaches it. Text alternates above and below the line on desktop and
// walks down a vertical line on mobile. Motivation: the site's one motif
// becomes the module's structure; a card grid becomes impossible.

export function PillarBand() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-pillar-line]", { scaleX: 1, scaleY: 1 });
        gsap.set("[data-pillar-line-v]", { scaleY: 1 });
        gsap.set("[data-pillar]", { opacity: 1, y: 0, scale: 1 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
      });
      // Horizontal strand draws left to right; the mobile strand draws top
      // to bottom. Only the visible one shows, both are cheap transforms.
      tl.fromTo("[data-pillar-line]", { scaleX: 0, scaleY: 1 }, { scaleX: 1, duration: 1.1, ease: "power2.inOut" });
      tl.fromTo(
        "[data-pillar-line-v]",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.1, ease: "power2.inOut" },
        "<"
      );
      tl.fromTo(
        "[data-pillar]",
        { opacity: 0, y: 14, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.09 },
        "-=0.7"
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      {/* Desktop: horizontal strand */}
      <div className="relative hidden py-16 md:block">
        <div
          data-pillar-line
          aria-hidden
          className="absolute left-0 right-0 top-1/2 h-px origin-left bg-gold opacity-70"
        />
        <ol className="relative grid grid-cols-5">
          {pillars.map((pillar, i) => {
            const above = i % 2 === 0;
            return (
              <li key={pillar.name} data-pillar className="relative flex flex-col items-center">
                <span
                  aria-hidden
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-gold ring-4 ring-[color-mix(in_srgb,var(--gold)_20%,transparent)]"
                />
                <div
                  className={`flex w-full max-w-[220px] flex-col items-center gap-1.5 text-center ${
                    above ? "-translate-y-1/2 pb-10" : "translate-y-1/2 pt-10"
                  }`}
                >
                  <span className="font-[family-name:var(--font-display)] text-lg text-gold-text">
                    {pillar.numeral}
                  </span>
                  <p className="text-display-sm">{pillar.name}</p>
                  <p className="text-[14px] leading-relaxed text-ink-muted">{pillar.line}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical line-walk */}
      <ol className="relative flex flex-col gap-10 pl-8 md:hidden">
        <span data-pillar-line-v aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-gold opacity-70" />
        {pillars.map((pillar) => (
          <li key={pillar.name} data-pillar className="relative">
            <span
              aria-hidden
              className="absolute -left-8 top-1.5 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-[color-mix(in_srgb,var(--gold)_20%,transparent)]"
            />
            <div className="flex flex-col gap-1">
              <span className="font-[family-name:var(--font-display)] text-base text-gold-text">
                {pillar.numeral} · {pillar.name}
              </span>
              <p className="text-[15px] leading-relaxed text-ink-muted">{pillar.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
