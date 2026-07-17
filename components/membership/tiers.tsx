import { tiers, visitorTier, type Tier } from "@/content/offerings";
import { ctaLabels } from "@/content/site";
import { BloomButton, QuietButton } from "@/components/garden/buttons";
import { PetalCard } from "@/components/garden/primitives";
import { Reveal, RevealItem } from "@/components/garden/reveal";

// TierColumn presentation per DESIGN.md anatomy and design ruling D4:
// Bloom featured (garden-deep outer bezel, gold hairline, Recommended tag,
// scale 1.02 on desktop), asymmetric 7/5 split on desktop, Visitor as a slim
// intro row above. Mobile: stacked cards with a native details disclosure,
// never a squeezed comparison table. No pricing toggle this phase.

function CheckGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="mt-1.5 h-3.5 w-3.5 shrink-0 text-sage"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2.5 8.5 6 12l7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusGlyph() {
  return (
    <span aria-hidden className="relative h-3.5 w-3.5 shrink-0 text-gold-text">
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-90 motion-reduce:transition-none" />
    </span>
  );
}

// Display class comes from the caller so "hidden" and "flex" never conflict.
function IncludesList({ items, className = "flex" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`flex-col gap-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted">
          <CheckGlyph />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Includes render twice, CSS-gated to the grid breakpoint: a plain list at
// desktop, a native details disclosure when the cards stack. display:none
// keeps the hidden copy out of the accessibility tree.
function TierIncludes({ tier }: { tier: Tier }) {
  return (
    <>
      <IncludesList items={tier.includes} className="hidden lg:flex" />
      <details className="group lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
          Everything included
          <PlusGlyph />
        </summary>
        <IncludesList items={tier.includes} className="flex pb-2 pt-2" />
      </details>
    </>
  );
}

function TierBody({ tier }: { tier: Tier }) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h3 className="text-display-sm">{tier.name}</h3>
        <p className="text-body">
          <span className="text-display-sm">{tier.price.monthly}/mo</span>{" "}
          <span className="text-[15px] text-ink-muted">
            or {tier.price.annual}/yr ({tier.price.annualNote})
          </span>
        </p>
        <p className="text-body text-ink-muted">{tier.lede}</p>
      </div>
      <TierIncludes tier={tier} />
      <p className="mt-auto border-t border-hairline pt-4 text-[15px] font-medium text-gold-text">
        {tier.conversationBenefit}
      </p>
      {tier.featured ? (
        <BloomButton href="#founding" className="self-start">
          {ctaLabels.foundingList}
        </BloomButton>
      ) : (
        <QuietButton href="#founding" className="self-start">
          {ctaLabels.foundingList}
        </QuietButton>
      )}
    </div>
  );
}

export function VisitorRow() {
  return (
    <Reveal>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-hairline px-7 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-baseline gap-3">
          <p className="text-display-sm">{visitorTier.name}</p>
          <p className="text-[15px] text-ink-muted">{visitorTier.price}</p>
        </div>
        <ul className="flex flex-col gap-1.5 text-[15px] text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-6">
          {visitorTier.includes.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-px w-3 bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function TierGrid() {
  const featured = tiers.find((t) => t.featured);
  const rest = tiers.filter((t) => !t.featured);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
      {featured ? (
        <RevealItem index={0} className="lg:col-span-7">
          <div
            className="flex h-full flex-col rounded-[2rem] bg-brand p-1.5 ring-1 ring-gold/60 lg:scale-[1.02]"
            style={{ boxShadow: "0 18px 50px var(--shadow-tint)" }}
          >
            <p className="py-2.5 text-center text-meta text-[#EFC66B]">Recommended</p>
            <div
              className="flex-1 rounded-[calc(2rem-6px)] bg-surface p-8"
              style={{
                boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--ink) 4%, transparent)",
              }}
            >
              <TierBody tier={featured} />
            </div>
          </div>
        </RevealItem>
      ) : null}
      {rest.map((tier, i) => (
        <RevealItem key={tier.slug} index={i + 1} className="lg:col-span-5">
          <PetalCard className="h-full" innerClassName="flex flex-col">
            <TierBody tier={tier} />
          </PetalCard>
        </RevealItem>
      ))}
    </div>
  );
}
