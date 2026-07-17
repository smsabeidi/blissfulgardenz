"use client";

import { useState } from "react";
import { firstSeason, type Video } from "@/content/library";
import { pillars } from "@/content/offerings";
import { RevealItem } from "@/components/garden/reveal";
import { EmptyState } from "@/components/garden/primitives";
import { WatchCard } from "@/components/watch/poster";

// Client-side pillar filtering over the first season. FilterChip anatomy per
// DESIGN.md: 36px pill, px-4, hairline border; active state uses the button
// tokens (brand + ivory in dawn, gold + soil in dusk). Filter changes are
// announced through an aria-live polite region.

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors duration-300 motion-reduce:transition-none ${
        active ? "bg-btn text-btn-ink" : "border border-hairline text-ink hover:bg-raised"
      }`}
    >
      {label}
    </button>
  );
}

export function WatchGrid() {
  const [active, setActive] = useState<Video["pillar"] | null>(null);

  const filtered = active ? firstSeason.filter((v) => v.pillar === active) : firstSeason;

  const announcement = active
    ? `${active} filter active. Showing ${filtered.length} of ${firstSeason.length} ${
        filtered.length === 1 ? "film" : "films"
      }.`
    : `Showing all ${firstSeason.length} films.`;

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="Filter films by pillar" className="flex flex-wrap items-center gap-3">
        <FilterChip label="All" active={active === null} onClick={() => setActive(null)} />
        {pillars.map((pillar) => (
          <FilterChip
            key={pillar.name}
            label={pillar.name}
            active={active === pillar.name}
            onClick={() => setActive(pillar.name)}
          />
        ))}
        {active ? (
          <button
            type="button"
            onClick={() => setActive(null)}
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline px-4 text-[14px] font-medium text-gold-text transition-colors duration-300 hover:bg-raised motion-reduce:transition-none"
          >
            <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
            </svg>
            Clear
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nothing planted here yet"
          body="This corner of the garden is not planted yet. Films for every pillar are coming as the season grows."
          action={
            // QuietButton's shared component has no onClick prop, so its exact
            // anatomy is reproduced here on a native button (noted in handoff).
            <button
              type="button"
              onClick={() => setActive(null)}
              className="group relative inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-hairline px-6 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-raised active:scale-[0.98] motion-reduce:transition-none"
            >
              <span className="relative">
                Clear the filter
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </span>
            </button>
          }
        />
      ) : (
        <ul
          key={active ?? "all"}
          aria-label="First season films"
          className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((video, i) => (
            <li key={video.slug} className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
              <RevealItem index={i} className="h-full">
                <WatchCard video={video} featured={i === 0} showDescription={i === 0} />
              </RevealItem>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
