import { disclaimer } from "@/content/site";

// The disclaimer pattern (design contract): a bordered quiet note carrying the
// approved educational-nature language from content/site.ts, with the crisis
// line on pages that meet people in harder seasons.
export function DisclaimerNote({
  crisis = false,
  className = "",
}: {
  crisis?: boolean;
  className?: string;
}) {
  return (
    <aside
      aria-label="About the nature of harmony conversations"
      className={`rounded-3xl border border-hairline px-7 py-6 ${className}`}
    >
      <p className="text-[14px] leading-relaxed text-ink-muted">{disclaimer.short}</p>
      {crisis ? (
        <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{disclaimer.crisis}</p>
      ) : null}
    </aside>
  );
}
