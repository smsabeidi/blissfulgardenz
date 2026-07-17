import type { ReactNode } from "react";

// LegalShell (DESIGN.md component vocabulary): Source Serif long-form document
// with a centered measure column. Every legal page opens with the counsel
// notice (PRD §20.4) until the client's lawyer signs off.

export function CounselNotice() {
  return (
    <div role="note" className="mt-10 flex items-start gap-3 rounded-2xl border border-hairline bg-raised px-6 py-5">
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-text"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M10 17V9M10 9c0-4 3-6 6-6 0 4-2.5 6-6 6z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 12c0-3-2.5-4.5-4.5-4.5 0 3 2 4.5 4.5 4.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-[14px] leading-relaxed text-ink-muted">
        <span className="font-medium text-ink">Draft for review.</span> This page awaits review
        by counsel before launch.
      </p>
    </div>
  );
}

export function LegalHeading({ children }: { children: ReactNode }) {
  return <h2 className="mb-5 mt-14 text-display-sm">{children}</h2>;
}

export function LegalShell({
  title,
  updated = "July 17, 2026",
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-[66ch]">
        <header className="flex flex-col gap-4">
          <h1 className="text-display-xl text-balance">{title}</h1>
          <p className="text-meta text-ink-muted">Last updated {updated}</p>
        </header>
        <CounselNotice />
        {intro}
        <div className="prose-garden mt-12">{children}</div>
      </div>
    </section>
  );
}
