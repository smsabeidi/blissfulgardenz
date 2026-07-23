"use client";

import { ArrowUp } from "@phosphor-icons/react/dist/ssr";

// One of the footer's round corner accessories (reference: unseen.co).
// Smooth scroll respects the user's reduced-motion preference.
export function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-brand-ink transition-colors duration-300 hover:bg-white/10"
    >
      <ArrowUp size={16} weight="light" />
    </button>
  );
}
