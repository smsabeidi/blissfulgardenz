"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Dawn/Dusk toggle: sun and moon morph inside one glyph; the choice persists
// when storage is available and quietly stays session-only when it is not
// (Safari private mode). Manual choice beats system preference. While the
// theme flips, data-theme-anim on <html> lets every themed surface crossfade
// on the same 600ms curve as <body> (globals.css).
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dawn" | "dusk">("dawn");
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dusk" || current === "dawn") setTheme(current);
    return () => {
      if (animTimer.current) clearTimeout(animTimer.current);
      document.documentElement.removeAttribute("data-theme-anim");
    };
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dawn" ? "dusk" : "dawn";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      document.documentElement.setAttribute("data-theme-anim", "1");
      if (animTimer.current) clearTimeout(animTimer.current);
      animTimer.current = setTimeout(() => {
        document.documentElement.removeAttribute("data-theme-anim");
      }, 650);
    }
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    try {
      localStorage.setItem("bg-theme", next);
    } catch {
      // Storage unavailable: the choice lives for this session only.
    }
  }, [theme]);

  const isDusk = theme === "dusk";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDusk}
      aria-label={isDusk ? "Switch to dawn mode" : "Switch to dusk mode"}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-current/25 text-current transition-[background-color,transform] duration-300 hover:bg-current/10 active:scale-[0.94] active:duration-75 motion-reduce:transition-none ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Sun core / moon body */}
        <circle
          cx="12"
          cy="12"
          r="4.5"
          className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: isDusk ? "translateX(1.5px)" : "none" }}
          fill={isDusk ? "currentColor" : "none"}
        />
        {/* Rays fade out at dusk */}
        <g
          strokeLinecap="round"
          className="origin-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: isDusk ? 0 : 1, transform: isDusk ? "scale(0.6) rotate(45deg)" : "none" }}
        >
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
        </g>
      </svg>
    </button>
  );
}
