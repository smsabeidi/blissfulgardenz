"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The Story Path (PRD §7.2, signature experience #5): four milestones along a
// vertical Horizon Line that draws downward with scroll (scaleY, transform
// only), each milestone blooming in as the drawn tip reaches it. Motivation:
// storytelling; the horizon motif walks the visitor through time.
//
// Reduced motion: the line renders fully drawn and milestones use the designed
// fade-only equivalent (opacity, no travel). GSAP only in this tree; the
// motion/react Reveal family is never nested inside it.
//
// Desktop: line at center, milestones alternate left/right. Mobile: line at
// the left edge, content to the right.

const milestones = [
  {
    era: "The medicine years",
    title: "A physician learns where harmony lives",
    body: "More than thirty-five years in medicine kept teaching Dr. Laiyemo the same lesson. The wellbeing of a family shapes the wellbeing of everyone in it.",
  },
  {
    era: "The advocacy",
    title: "Two decades spent tending families",
    body: "Long before this garden had a name, he was a quiet advocate for family harmony. Twenty years of listening, speaking, and sitting with couples.",
  },
  {
    era: "The trilogy · 2017 to 2020",
    title: "Three guys start talking",
    body: "Blissful Gardenz Inc published the Three Guys Talking trilogy: three friends, three marriages, one honest conversation carried across three books.",
  },
  {
    era: "The garden",
    title: "A garden is planted",
    body: "The conversations asked for a home of their own. Blissful Gardenz became that place: a garden kept for harmony conversations, open in every season.",
  },
] as const;

export function StoryPath() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-path-line]", { scaleY: 1 });
        gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            }
          );
        });
        return;
      }

      // Start and end share the same viewport offset, so the drawn tip of the
      // line holds steady at 70% of the viewport while the page scrolls.
      gsap.fromTo(
        "[data-path-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      // Each milestone blooms once, just as the tip reaches it.
      gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 76%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative">
      {/* The vertical Horizon Line: faint track beneath, drawn gold above. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-2 top-0 w-px md:left-1/2 md:-translate-x-1/2"
      >
        <div className="absolute inset-0 bg-gold opacity-[0.18]" />
        <div data-path-line className="absolute inset-0 origin-top bg-gold opacity-60" />
      </div>

      <ol
        className="relative flex flex-col gap-16 md:gap-28"
        aria-label="The story of Blissful Gardenz, in four seasons"
      >
        {milestones.map((m, i) => {
          const left = i % 2 === 0;
          return (
            <li
              key={m.title}
              data-milestone
              className={`relative pl-10 md:w-[calc(50%_-_4rem)] md:pl-0 ${
                left ? "md:self-start" : "md:self-end"
              }`}
            >
              {/* A short horizon tick joins the line to its milestone. */}
              <span
                aria-hidden
                className={`absolute left-2 top-2 h-px w-6 bg-gold opacity-70 md:w-10 ${
                  left ? "md:left-auto md:right-[-4rem]" : "md:left-[-4rem]"
                }`}
              />
              <p className="text-meta text-gold-text">{m.era}</p>
              <h3 className="text-display-sm mt-3 text-balance">{m.title}</h3>
              <p className="text-body mt-3 max-w-[46ch] text-ink-muted">{m.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
