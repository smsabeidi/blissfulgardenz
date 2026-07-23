"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctaLabels } from "@/content/site";
import { Magnetic } from "@/components/garden/motion-reveals";

gsap.registerPlugin(ScrollTrigger);

// The Living Garden hero: a cinematic camera flight through the garden that
// the visitor SCRUBS by scrolling. A tall section holds a sticky, viewport-
// sized stage; as the section scrolls past, scroll progress drives the film's
// playhead frame by frame (the encode is all-keyframes, so every seek is
// instant). The gold Horizon Line at the foot fills as the flight advances,
// and the stage stays fixed in view until the film reaches its end, at which
// point the section releases and the page continues. Sticky positioning is
// used instead of a GSAP pin so the effect is immune to transformed ancestors
// (the route-transition wrapper) and to StrictMode double-mounting.
//
// Scrub is a desktop-with-a-mouse experience. Touch devices (janky video
// seeking) and reduced-motion visitors get the same film as a calm autoplay
// loop in a single stationary viewport. The poster paints instantly under
// everything, so the hero is never empty.

const SCRUB_TRAVEL_VH = 360; // viewports of scroll spent inside the flight

export function HeroScroll({
  videoSrc,
  videoSrcMobile,
}: {
  videoSrc?: string | null;
  videoSrcMobile?: string | null;
}) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  // null until decided on the client, so SSR never guesses wrong.
  const [scrub, setScrub] = useState<boolean | null>(null);

  // Cream header treatment while it floats over the dark film.
  useEffect(() => {
    document.body.dataset.darkhero = "1";
    return () => {
      delete document.body.dataset.darkhero;
    };
  }, []);

  // Decide the mode once on the client: scrub only for fine pointers on a wide
  // viewport with motion allowed; everyone else gets the autoplay loop.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setScrub(Boolean(videoSrc) && fine && wide && !reduce);
  }, [videoSrc]);

  // Loop mode (touch / reduced-motion / no video): play the film gently.
  useEffect(() => {
    if (scrub !== false) return;
    const v = videoRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (v && !reduce) {
      v.loop = true;
      v.play().catch(() => {});
    }
  }, [scrub]);

  // Scrub mode: drive currentTime + copy choreography from section progress.
  useEffect(() => {
    if (scrub !== true || !root.current) return;
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.loop = false;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const vid = videoRef.current;
            if (vid && vid.duration) {
              // Leave a sliver so we never park on a black last frame.
              vid.currentTime = self.progress * (vid.duration - 0.05);
            }
          },
        },
      });

      // The Horizon Line traces the whole flight (this IS the progress bar).
      tl.fromTo("[data-hero-progress]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      // Motto drifts up a touch across the journey; it never leaves.
      tl.to("[data-hero-motto]", { yPercent: -8, duration: 1 }, 0);
      // Lede and pill recede once the traveller is underway.
      tl.to("[data-hero-lede]", { opacity: 0, y: -14, duration: 0.35 }, 0.12);
      tl.to("[data-hero-pill]", { opacity: 0, y: -12, duration: 0.3 }, 0.2);
      // Arrival: the closing invitation resolves in the final stretch.
      tl.fromTo(
        "[data-hero-arrival]",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.22 },
        0.8
      );
    }, root);

    return () => ctx.revert();
  }, [scrub]);

  const arrow = (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 4h8v8M12 4L4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Tall only in scrub mode (the extra height is the scroll runway). In loop
  // / reduced-motion / SSR it's a single stationary viewport.
  const tall = scrub === true;

  return (
    <section
      ref={root}
      aria-label="Welcome"
      data-ground="dark"
      className="relative bg-[#0b1f16]"
      style={tall ? { height: `calc(100dvh + ${SCRUB_TRAVEL_VH}dvh)` } : undefined}
    >
      {/* The sticky stage: viewport-sized, stays in view while the section
          scrolls past. Immune to transformed ancestors (no GSAP pin). */}
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden">
        {/* L1 · The film, with the poster painting instantly underneath */}
        <div className="absolute inset-0">
          <Image
            src="/images/photos/hero-green.jpg"
            alt="A garden at golden hour: an enormous sun resting on a green horizon, mirrored in a still reflecting pool, with two chairs facing each other on the lawn between cypress and olive trees."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {videoSrc ? (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            >
              {videoSrcMobile ? (
                <source src={videoSrcMobile} media="(max-width: 767px)" type="video/mp4" />
              ) : null}
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : null}
        </div>

        {/* L2 · Depth floor so ivory type always clears AA over the film */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,31,22,0.46) 0%, rgba(11,31,22,0.12) 30%, rgba(11,31,22,0.16) 60%, rgba(11,31,22,0.62) 100%)",
          }}
        />

        {/* L3 · Filmic grain, local to the hero */}
        <div aria-hidden className="hero-grain absolute inset-0" />

        {/* L4 · The motto */}
        <div className="relative z-10 mx-auto flex w-full max-w-[92rem] flex-1 flex-col items-center justify-center gap-7 px-5 pb-40 pt-24 text-center lg:px-8">
          <div data-hero-motto>
            {/* Each phrase rises out of its own mask, one beat apart (pure CSS,
                so a stalled ticker can never strand it). */}
            <h1 className="font-[family-name:var(--font-display)] text-balance text-[clamp(3rem,9.5vw,8.75rem)] font-[440] leading-[0.98] tracking-[-0.04em] text-[#f5f3ea] [text-shadow:0_2px_40px_rgba(11,31,22,0.5)]">
              <span className="hero-mask">
                <span className="hero-word" style={{ "--word-i": 0 } as React.CSSProperties}>
                  Harmony
                </span>
              </span>{" "}
              <span className="hero-mask">
                <span className="hero-word" style={{ "--word-i": 1 } as React.CSSProperties}>
                  <em className="font-[420] italic text-[#e4ce7f]">on the</em>
                </span>
              </span>{" "}
              <span className="hero-mask">
                <span className="hero-word" style={{ "--word-i": 2 } as React.CSSProperties}>
                  horizon.
                </span>
              </span>
            </h1>
          </div>
          {/* GSAP scrubs opacity on these plain wrappers; the CSS entrance
              (hero-rise, fill:both) lives on the inner element so the two
              never fight over the same property. */}
          <div data-hero-lede>
            <p
              className="hero-rise max-w-xl text-balance text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] leading-relaxed text-[#d8e0d2]"
              style={{ "--rise-i": 2 } as React.CSSProperties}
            >
              Enduring, healthy relationships are grown on purpose. This is where they are tended.
            </p>
          </div>
          <div data-hero-pill className="mt-3">
            <div
              className="hero-rise"
              style={{ "--rise-i": 3 } as React.CSSProperties}
            >
              <Magnetic>
                <Link
                  href="/membership"
                  className="group inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#f3f1e6] pl-7 pr-5 text-[15px] font-medium tracking-[0.01em] text-[#0f2e22] shadow-[0_10px_40px_rgba(11,31,22,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98] active:duration-75 motion-reduce:transition-none"
                >
                  {ctaLabels.membership}
                  {arrow}
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Arrival: resolves only at the end of the flight (scrub mode). */}
          {tall ? (
            <div
              data-hero-arrival
              className="pointer-events-none absolute inset-x-0 bottom-24 flex flex-col items-center gap-4 opacity-0"
            >
              <p className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,1rem+1vw,1.9rem)] italic text-[#f5f3ea]">
                Come in. The garden is open.
              </p>
              <Magnetic>
                <Link
                  href="/membership"
                  className="pointer-events-auto group inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#f3f1e6] pl-7 pr-5 text-[15px] font-medium tracking-[0.01em] text-[#0f2e22] shadow-[0_10px_40px_rgba(11,31,22,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-[0.98] active:duration-75"
                >
                  {ctaLabels.membership}
                  {arrow}
                </Link>
              </Magnetic>
            </div>
          ) : null}
        </div>

        {/* L5 · The Horizon Line: fills as the flight advances (scrub), or
               rests full as a quiet rule (loop). */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[#e4ce7f]/20">
          <div
            data-hero-progress
            className="h-full origin-left bg-[#e4ce7f]"
            style={{ transform: tall ? "scaleX(0)" : "scaleX(1)" }}
          />
        </div>

        {/* Corner meta (unseen.co accessory): the invitation, quietly */}
        <p
          className="hero-rise text-meta absolute bottom-8 left-5 z-10 text-brand-ink/75 lg:left-8"
          style={{ "--rise-i": 4 } as React.CSSProperties}
        >
          A garden of bliss for the people
        </p>
      </div>
    </section>
  );
}
