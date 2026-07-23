"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { illustrativeStories, storiesLabel } from "@/content/library";

// One beautifully typeset story at a time (adapted from 21st.dev "Minimal
// Testimonial"): Cormorant italic quote with a soft blur/fade crossfade,
// initials as the selector row (no stock faces, ever), auto-advance that
// pauses on hover/focus and disables under reduced motion. Illustrative
// label per design ruling D21.

const ROTATE_MS = 6500;

export function BlossomWall() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduce.current) return;
    timer.current = setInterval(
      () => setActive((a) => (a + 1) % illustrativeStories.length),
      ROTATE_MS
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const select = useCallback((i: number) => {
    setActive(i);
    setPaused(true);
  }, []);

  return (
    <div
      className="mx-auto flex max-w-3xl flex-col gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Disclosure label per ruling D21; gold-text instead of the spec'd
          sage because sage measures 1.8:1 on canvas and this line is a
          required disclosure, not decoration. */}
      <p className="text-meta text-gold-text">{storiesLabel}</p>

      {/* Quote stage */}
      <div className="relative min-h-[9.5rem] sm:min-h-[8rem]" aria-live="polite">
        {illustrativeStories.map((story, i) => (
          <blockquote
            key={story.name}
            aria-hidden={active !== i}
            className={`absolute inset-0 font-[family-name:var(--font-display)] text-[1.7rem] italic leading-[1.3] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[2.1rem] ${
              active === i
                ? "translate-y-0 opacity-100 blur-0"
                : "pointer-events-none translate-y-3 opacity-0 blur-sm"
            }`}
          >
            &ldquo;{story.quote}&rdquo;
          </blockquote>
        ))}
      </div>

      {/* Selector row */}
      <div className="flex items-center gap-6">
        <div className="flex -space-x-1.5">
          {illustrativeStories.map((story, i) => (
            <button
              key={story.name}
              type="button"
              onClick={() => select(i)}
              aria-label={`Story from ${story.name}`}
              aria-pressed={active === i}
              className={`relative flex h-11 w-11 select-none items-center justify-center rounded-full font-[family-name:var(--font-display)] text-sm ring-2 ring-[var(--canvas)] transition-[transform,background-color,color] duration-300 ${
                active === i
                  ? "z-10 scale-110 bg-brand text-brand-ink"
                  : "bg-[color-mix(in_srgb,var(--sage)_26%,transparent)] text-ink hover:scale-105"
              }`}
            >
              {story.name.charAt(0)}
            </button>
          ))}
        </div>
        <div aria-hidden className="h-9 w-px bg-hairline" />
        <div className="relative min-h-[2.75rem] flex-1">
          {illustrativeStories.map((story, i) => (
            <div
              key={story.name}
              aria-hidden={active !== i}
              className={`absolute inset-0 flex flex-col justify-center transition-[opacity,transform] duration-400 ${
                active === i ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-2 opacity-0"
              }`}
            >
              <span className="text-[15px] font-medium">{story.name}</span>
              <span className="text-[13px] text-ink-muted">{story.stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
