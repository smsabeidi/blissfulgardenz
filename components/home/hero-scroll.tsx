"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctaLabels } from "@/content/site";
import { Magnetic } from "@/components/garden/motion-reveals";
import { HeroPoem } from "@/components/home/hero-poem";
import { poem } from "@/content/poem";

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

// Viewports of scroll spent inside the flight. Raised from 360 to give the poem
// room to be read rather than flickered through: nine rungs occupy the middle
// ~46% of the runway, which works out to roughly a quarter-viewport of scroll
// each. Scrubbing means the visitor sets the pace and can hold on any line.
const SCRUB_TRAVEL_VH = 520;

// THE FLIGHT HAS FOUR MOVEMENTS, AND THEY DO NOT OVERLAP.
//
// That rule is the whole fix. The opening (headline, lede, pill) used to fade
// out over 0.35 and 0.30 of the timeline while the poem began at 0.30, so on a
// desktop the second rung — "I want to be in your arms" — arrived on top of a
// lede still at 33% and a membership pill still at 49%. Two things asking to be
// read at once, which on a wide viewport reads as a mistake rather than a
// dissolve. On touch it never showed, because touch gets the plain stanza.
//
// So the opening now withdraws briskly and COMPLETELY, there is a beat of
// nothing but the film, and only then does the poem begin. One thing to read at
// a time, always.
//
//   0.00 → 0.12   the opening holds
//   0.12 → 0.24   the opening withdraws — ALL of it (see below)
//   0.24 → 0.32   an empty stage: nothing but the garden, for a full beat
//   0.32 → 0.36   the poem's ground and its title arrive
//   0.36 → 0.80   the verse, one rung at a time
//   0.80 → 1.00   the coda, the poet, the invitation
//
// "ALL of it" is meant literally, and it is the part that was wrong twice.
// The stage carries five things at the start, not three: the headline, the
// lede, the membership pill, the Horizon Line, and the corner line reading
// "A garden of bliss for the people". That last one had no handle on it at all
// — the timeline never referenced it — so it sat in the bottom corner through
// the entire poem. Only the Horizon Line stays now, and it stays on purpose:
// it is the progress indicator, a 1px rule at the very foot of the frame.
//
// There is also a real, empty beat between the two — eight percent of the
// scroll with nothing on screen. Handing straight from one to the other reads
// as a cross-fade, and a cross-fade is the thing being complained about.
//
// These are fractions of SCROLL, and they are only true if the timeline is
// exactly 1.0 long — see the note on the arrival tween at the foot of the
// sequence, which used to run to 1.08 and quietly compress everything above.
const INTRO_OUT = 0.12;
const INTRO_GONE = 0.24;
/** The poem's ground and title arrive. Nothing is on screen before this. */
const POEM_IN = 0.32;
/** The first rung. Deliberately after POEM_IN, so the title lands first. */
const RUNGS_START = 0.36;
const POEM_END = 0.8;
const CODA_AT = 0.83;
const RUNG_STEP = (POEM_END - RUNGS_START) / poem.rungs.length;
// A third of each rung's time is the dissolve, two thirds is the hold. A hard
// cut between two lines of a poem reads as a slide deck; a long dissolve reads
// as indecision. This is the middle, and it is where the line sits still.
const RUNG_FADE = RUNG_STEP * 0.3;

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
  // True only once the scroll timeline is actually built. The poem asks for its
  // stacked layout on this, not on `scrub`, because stacked rungs are only
  // legible while something is cross-fading them. If GSAP never initialises,
  // this stays false and the poem lays out as an ordinary readable stanza
  // rather than nine lines piled on one another.
  const [timelineReady, setTimelineReady] = useState(false);

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

      // ── Movement one: the opening withdraws, completely ───────────────────
      // Reverse order of arrival — the pill and lede came last, so they leave
      // first and the headline is the last thing standing. Each fade is short
      // and finished; nothing here is still on screen when the poem starts.
      //
      // autoAlpha, NOT opacity. autoAlpha is opacity plus visibility, so at zero
      // these are genuinely gone rather than merely transparent. Two reasons
      // that matters here. A transparent element still answers the mouse, and
      // "Explore Membership" is a real link sitting directly over the middle of
      // the poem — at opacity 0 it was an invisible click target across the
      // verse. And `visibility: hidden` takes the whole subtree out of the
      // accessibility tree, so a screen reader stops offering a lede and a
      // membership link that a sighted visitor can no longer see.
      tl.to("[data-hero-pill]", { autoAlpha: 0, y: -12, duration: 0.08 }, INTRO_OUT);
      tl.to("[data-hero-lede]", { autoAlpha: 0, y: -14, duration: 0.08 }, INTRO_OUT + 0.03);
      // The headline drifts as the camera moves, then yields the stage. An
      // 8.75rem headline and a poem cannot share a centre: one of them has to
      // be the thing you are reading. The drift ends when the headline does —
      // it used to keep tweening for the whole flight, invisible, for nothing.
      tl.to("[data-hero-motto]", { yPercent: -14, duration: INTRO_GONE }, 0);
      tl.to("[data-hero-motto]", { autoAlpha: 0, duration: 0.08 }, INTRO_GONE - 0.08);
      // And the corner line, which used to sit out the whole poem in the bottom
      // left because nothing in this timeline had ever referred to it.
      tl.to("[data-hero-meta]", { autoAlpha: 0, duration: 0.08 }, INTRO_OUT);

      // ── Movement two: a scrim settles, so the verse has a ground ──────────
      // The poem is ivory and gold type laid over a moving film, and the only
      // thing that was holding it up was a 40px text-shadow on every line. A
      // shadow makes type survive a bright frame; it does not make it calm. This
      // is a soft pool of the garden's own deep green that arrives with the poem
      // and stays through the coda, so every line is read against one steady
      // ground instead of whatever the film happens to be doing.
      tl.fromTo("[data-poem-scrim]", { opacity: 0 }, { opacity: 1, duration: 0.05 }, POEM_IN);

      // ── Movement three: "Time well spent" ─────────────────────────────────
      // The container simply becomes present; each rung governs its own moment
      // inside it, so the poem can never half-appear between two lines.
      tl.fromTo("[data-hero-poem]", { opacity: 0 }, { opacity: 1, duration: 0.03 }, POEM_IN);
      // The title stands above the verse for the whole poem and leaves with it.
      // It used to duck out after the second rung, which left the reader with
      // nine unattributed lines; a poem keeps its title at the top of the page.
      tl.fromTo(
        "[data-poem-title]",
        { opacity: 0, y: 10 },
        { opacity: 0.9, y: 0, duration: 0.04 },
        POEM_IN + 0.01
      );
      tl.to("[data-poem-title]", { opacity: 0, duration: 0.03 }, CODA_AT - 0.03);

      // Each rung rises, holds, and gives way to the next. The overlap is
      // deliberate: a hard cut between two lines of a poem reads as a slide
      // deck, while a brief dissolve reads as one thought becoming the next.
      poem.rungs.forEach((_, i) => {
        const at = RUNGS_START + i * RUNG_STEP;
        tl.fromTo(
          `[data-poem-rung="${i}"]`,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: RUNG_FADE },
          at
        );
        tl.to(
          `[data-poem-rung="${i}"]`,
          { opacity: 0, y: -18, duration: RUNG_FADE },
          at + RUNG_STEP - RUNG_FADE * 0.35
        );
      });

      // ── Movement four: the coda, the poet, the invitation ─────────────────
      // The coda arrives last and does not leave: "I love you." is the line the
      // visitor should still be looking at when the invitation appears.
      tl.fromTo(
        "[data-poem-coda]",
        { opacity: 0, y: 22, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.05 },
        CODA_AT
      );
      // The poet's name, which until now only a screen reader ever received.
      // A poem carries its author; that is not decoration, it is the courtesy
      // owed to the person who wrote it.
      tl.fromTo(
        "[data-poem-byline]",
        { opacity: 0, y: 10 },
        { opacity: 0.75, y: 0, duration: 0.05 },
        CODA_AT + 0.05
      );

      // Arrival: the closing invitation resolves beneath the coda.
      //
      // ENDS AT 1.0 ON PURPOSE. This used to start at 0.86 with a duration of
      // 0.22, which made the timeline 1.08 long — so GSAP scaled everything
      // above by 1/1.08 and every named constant in this file quietly meant
      // something 7% earlier than it said, while the Horizon Line finished
      // filling at 93% of the scroll and then sat there. Nothing after this
      // tween may run past 1.0.
      tl.fromTo(
        "[data-hero-arrival]",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.88
      );
    }, root);

    setTimelineReady(true);
    return () => {
      setTimelineReady(false);
      ctx.revert();
    };
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
      {/* Sticky, fixed-height and clipped ONLY when there is a runway to stick
          through. In every other mode the poem reads as a stanza in normal flow
          inside this stage, so the stage must be free to grow with it: a fixed
          100dvh with overflow-hidden guillotines the poem after the fourth
          rung, and a sticky stage above flowing content pins the film while the
          stanza scrolls up through it. */}
      <div
        className={
          tall
            ? "sticky top-0 flex h-[100dvh] flex-col overflow-hidden"
            : "relative flex min-h-[100dvh] flex-col"
        }
      >
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

        {/* L3b · The reading ground for the poem.
            Sits above the film and below the type. Held at zero until the
            opening has cleared, then brought up by the timeline and left there
            for the rest of the flight, so the verse, the coda and the closing
            invitation are all read against the same steady surface rather than
            against whatever the camera is flying past. Only rendered where
            there is a timeline to raise it. */}
        {tall ? (
          <div
            data-poem-scrim
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5] opacity-0"
            style={{
              background:
                "radial-gradient(ellipse 82% 58% at 50% 50%, rgba(8,20,14,0.74) 0%, rgba(8,20,14,0.6) 42%, rgba(8,20,14,0.28) 68%, rgba(8,20,14,0) 88%)",
            }}
          />
        ) : null}

        {/* L4 · The motto */}
        <div className="relative z-10 mx-auto flex w-full max-w-[92rem] flex-1 flex-col items-center justify-center gap-7 px-5 pb-40 pt-24 text-center lg:px-8">
          <div data-hero-motto>
            {/* Each phrase rises out of its own mask, one beat apart (pure CSS,
                so a stalled ticker can never strand it). */}
            <h1 className="font-[family-name:var(--font-display)] text-balance text-[clamp(3rem,9.5vw,8.75rem)] font-[500] leading-[1.02] tracking-[-0.02em] text-[#f5f3ea] [text-shadow:0_2px_40px_rgba(11,31,22,0.5)]">
              <span className="hero-mask">
                <span className="hero-word" style={{ "--word-i": 0 } as React.CSSProperties}>
                  Harmony
                </span>
              </span>{" "}
              <span className="hero-mask">
                <span className="hero-word" style={{ "--word-i": 1 } as React.CSSProperties}>
                  <em className="font-[480] italic text-[#e4ce7f]">on the</em>
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

          {/* L4b · "Time well spent".
              ONE render position, in both modes, and that is load-bearing.
              Rendering the stacked version here and the reading version
              elsewhere made React unmount one and mount the other the moment
              the timeline came up, so every tween kept animating detached nodes
              while nine freshly-built, unstyled rungs piled up on screen. Same
              slot means React reuses the same elements, and the opening state
              GSAP wrote survives the switch to the stacked layout. */}
          <HeroPoem animated={tall && timelineReady} />

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

        {/* Corner meta (unseen.co accessory): the invitation, quietly.
            data-hero-meta so the timeline can take it away with the rest of the
            opening. Without a handle it had none, and quietly outstayed the
            headline it belongs to by the entire length of the poem. */}
        <p
          data-hero-meta
          className="hero-rise text-meta absolute bottom-8 left-5 z-10 text-brand-ink/75 lg:left-8"
          style={{ "--rise-i": 4 } as React.CSSProperties}
        >
          A garden of bliss for the people
        </p>
      </div>

    </section>
  );
}
