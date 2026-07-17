"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctaLabels } from "@/content/site";
import { BloomButton, QuietButton } from "@/components/garden/buttons";

gsap.registerPlugin(ScrollTrigger);

// Image-led editorial hero (redesign pass). Full-bleed golden-hour garden
// photograph (Higgsfield, client-swappable), bottom-left editorial type block
// (anti-center bias), the Horizon Line drawn at the photo's horizon, and a
// slow Ken Burns drift on the image. Dusk theme swaps to the dusk photograph.
// First-visit choreography: line draws, then type rises out of a soft blur.

export function HeroDawn() {
  const root = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<"dawn" | "dusk">("dawn");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dusk") setTheme("dusk");
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "dusk" ? "dusk" : "dawn");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
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
        gsap.set("[data-hero-line]", { scaleX: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (firstVisit) {
        tl.fromTo("[data-hero-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.7 })
          .fromTo(
            "[data-hero-reveal]",
            { opacity: 0, y: 22, filter: "blur(8px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.1 },
            "-=0.35"
          );
      } else {
        gsap.set("[data-hero-line]", { scaleX: 1 });
        tl.fromTo(
          "[data-hero-reveal]",
          { opacity: 0, y: 14, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.07 }
        );
      }

      // Ken Burns drift: the photograph breathes, 14s, scale only.
      gsap.fromTo(
        "[data-hero-photo]",
        { scale: 1.06 },
        { scale: 1, duration: 14, ease: "none" }
      );

      // Gentle parallax on scroll out.
      gsap.to("[data-hero-photo]", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="Welcome" className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      {/* Full-bleed photograph, theme-matched */}
      <div className="absolute inset-0 overflow-hidden">
        <div data-hero-photo className="absolute inset-0 will-change-transform">
          <Image
            src={theme === "dusk" ? "/images/photos/hero-dusk.jpg" : "/images/photos/hero-dawn.jpg"}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Contrast scrim: canvas rises from below, quiet dark wash above */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--canvas) 0%, color-mix(in srgb, var(--canvas) 55%, transparent) 14%, transparent 38%), linear-gradient(to bottom, rgba(11,21,18,0.38) 0%, rgba(11,21,18,0.08) 30%, transparent 55%)",
          }}
        />
      </div>

      {/* Editorial type block, bottom-left; the Horizon Line opens the block */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-[12dvh] pt-28 lg:px-8">
        <div
          data-hero-line
          aria-hidden
          className="mb-8 h-px w-full max-w-md origin-left bg-gold opacity-80"
        />
        <p
          data-hero-reveal
          className="text-meta mb-6 text-[#F4EFDF] [text-shadow:0_1px_12px_rgba(11,21,18,0.5)]"
        >
          A garden of bliss for the people
        </p>
        <h1
          data-hero-reveal
          className="text-display-xl max-w-4xl text-balance text-[#FBF8EE] [text-shadow:0_2px_24px_rgba(11,21,18,0.55)]"
        >
          Harmony on the horizon.
        </h1>
        <p
          data-hero-reveal
          className="text-lede mt-6 max-w-xl text-balance !text-[#EFE9D8] [text-shadow:0_1px_12px_rgba(11,21,18,0.5)]"
        >
          Enduring, healthy relationships are grown on purpose. This is where they are tended.
        </p>
        <div data-hero-reveal className="mt-10 flex flex-col gap-4 sm:flex-row">
          <BloomButton href="/membership" tone="gold">
            {ctaLabels.membership}
          </BloomButton>
          <QuietButton
            href="/about/dr-laiyemo"
            className="!border-[#F4EFDF]/40 !text-[#FBF8EE] hover:!bg-[#0B1512]/25"
          >
            {ctaLabels.meetFounder}
          </QuietButton>
        </div>
      </div>
    </section>
  );
}
