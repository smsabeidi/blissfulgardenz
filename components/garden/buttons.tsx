import Link from "next/link";
import type { ReactNode } from "react";

// BloomButton and QuietButton per DESIGN.md component anatomy. Pure CSS
// interaction (server-safe): petal glyph blooms behind the label on hover,
// nested arrow circle drifts diagonally, active press scales down.

function PetalGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-35 motion-reduce:transition-none"
    >
      <g fill="currentColor">
        <ellipse cx="24" cy="12" rx="6" ry="10" />
        <ellipse cx="24" cy="36" rx="6" ry="10" />
        <ellipse cx="12" cy="24" rx="10" ry="6" />
        <ellipse cx="36" cy="24" rx="10" ry="6" />
      </g>
    </svg>
  );
}

function ArrowCircle() {
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 items-center justify-center rounded-full bg-current/0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-px group-hover:translate-x-1 motion-reduce:transition-none"
      style={{ backgroundColor: "color-mix(in srgb, currentColor 14%, transparent)" }}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

type ButtonProps = {
  href?: string;
  children: ReactNode;
  arrow?: boolean;
  external?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  /** "gold" is for permanently dark surfaces (bg-brand sections), where the
   *  theme-following dawn button (deep green) would vanish into the ground. */
  tone?: "auto" | "gold";
};

export function BloomButton({
  href,
  children,
  arrow = true,
  external,
  className = "",
  type = "button",
  disabled,
  tone = "auto",
}: ButtonProps) {
  const palette =
    tone === "gold" ? "bg-[#D8B23A] text-[#0B1512]" : "bg-btn text-btn-ink";
  const classes = `group relative inline-flex h-12 items-center justify-center gap-3 whitespace-nowrap rounded-full ${palette} pl-7 ${
    arrow ? "pr-3" : "pr-7"
  } text-[15px] font-medium tracking-[0.01em] transition-transform duration-300 active:scale-[0.98] motion-reduce:transition-none ${className}`;

  const inner = (
    <>
      <span className="relative">
        <PetalGlyph />
        <span className="relative">{children}</span>
      </span>
      {arrow ? <ArrowCircle /> : null}
    </>
  );

  if (href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} className={`${classes} disabled:opacity-60`}>
      {inner}
    </button>
  );
}

export function QuietButton({ href, children, external, className = "" }: ButtonProps) {
  const classes = `group relative inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-hairline px-6 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-raised active:scale-[0.98] motion-reduce:transition-none ${className}`;
  const inner = (
    <span className="relative">
      {children}
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
      />
    </span>
  );
  if (href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={classes}>
      {inner}
    </button>
  );
}
