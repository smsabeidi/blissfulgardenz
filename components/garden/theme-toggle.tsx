"use client";

import { useCallback, useEffect, useState } from "react";

// Dawn/Dusk toggle: sun and moon morph inside one glyph; the choice persists
// when storage is available and quietly stays session-only when it is not
// (Safari private mode). Manual choice beats system preference.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dawn" | "dusk">("dawn");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dusk" || current === "dawn") setTheme(current);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dawn" ? "dusk" : "dawn";
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
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink transition-colors duration-300 hover:bg-raised ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.5">
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
