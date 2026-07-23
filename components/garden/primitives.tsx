import type { ReactNode } from "react";
import { MaskRise } from "./motion-reveals";
import { Reveal } from "./reveal";

// Eyebrow: rationed to max 1 per 3 sections (DESIGN.md). The gold dash is part
// of the anatomy. tone="dark" is for sections with a permanently dark surface
// (bg-brand), where the theme-following gold-text would fail contrast in dawn.
export function Eyebrow({ children, tone = "auto" }: { children: ReactNode; tone?: "auto" | "dark" }) {
  return (
    <p className={`text-meta flex items-center gap-3 ${tone === "dark" ? "text-[#e3c25b]" : "text-gold-text"}`}>
      <span aria-hidden className={`inline-block h-px w-6 ${tone === "dark" ? "bg-[#c9a227]" : "bg-gold"}`} />
      {children}
    </p>
  );
}

// SectionHeading: stacked vertically (split-header pattern is banned).
// Owns its entrance choreography: the display title rises out of a mask
// while eyebrow and lede fade up around it. Callers must NOT wrap this in
// another Reveal (double entrances read as jitter).
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Tag className="text-display max-w-4xl text-balance">
        <MaskRise delay={eyebrow ? 0.1 : 0}>{title}</MaskRise>
      </Tag>
      {lede ? (
        <Reveal delay={eyebrow ? 0.22 : 0.14}>
          <p className="text-lede max-w-[65ch]">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

// PetalCard: the double-bezel premium card (outer shell + concentric inner core).
export function PetalCard({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] bg-raised p-1.5 ring-1 ring-hairline ${className}`}
      style={{ boxShadow: "0 18px 50px var(--shadow-tint)" }}
    >
      <div
        className={`h-full rounded-[calc(2rem-6px)] bg-surface p-8 ${innerClassName}`}
        style={{ boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--ink) 4%, transparent)" }}
      >
        {children}
      </div>
    </div>
  );
}

// EmptyState: "considered emptiness". An unplanted seed, an invitation, an action.
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <svg aria-hidden viewBox="0 0 64 64" className="h-14 w-14 text-sage">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 52h40" />
          <path d="M32 52V34" />
          <path d="M32 34c0-8 6-12 12-12 0 8-5 12-12 12z" fill="color-mix(in srgb, currentColor 18%, transparent)" />
          <path d="M32 40c0-6-5-9-9-9 0 6 4 9 9 9z" fill="color-mix(in srgb, currentColor 12%, transparent)" />
        </g>
      </svg>
      <p className="text-display-sm">{title}</p>
      <p className="text-body max-w-md text-ink-muted">{body}</p>
      {action}
    </div>
  );
}

// HorizonRule: the section-draw role of the Horizon Line. CSS-animated on
// first view via animation-timeline fallback: a simple keyframe triggered by
// the Reveal wrapper is enough; static under reduced motion (globals.css).
export function HorizonRule({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`horizon-rule w-full ${className}`} />;
}
