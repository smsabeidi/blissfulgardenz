import { disclaimer } from "@/content/site";

// The disclaimer pattern: a bordered quiet note carrying disclaimer.short,
// with disclaimer.crisis added only where a page calls for it.

export function DisclaimerNote({ crisis = false }: { crisis?: boolean }) {
  return (
    <aside
      aria-label="A note on what harmony conversations are"
      className="rounded-2xl border border-hairline px-7 py-6"
    >
      <p className="text-[14px] leading-relaxed text-ink-muted">{disclaimer.short}</p>
      {crisis ? (
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{disclaimer.crisis}</p>
      ) : null}
    </aside>
  );
}
