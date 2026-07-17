import Image from "next/image";
import Link from "next/link";
import { HeroDawn } from "@/components/home/hero-dawn";
import { PillarBand } from "@/components/home/pillar-band";
import { TrilogyShelf } from "@/components/home/trilogy-shelf";
import { BlossomWall } from "@/components/home/blossom-wall";
import { FoundingBloom } from "@/components/home/founding-bloom";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow, SectionHeading, PetalCard } from "@/components/garden/primitives";
import { BloomButton, QuietButton } from "@/components/garden/buttons";
import { brand, ctaLabels } from "@/content/site";
import { offerings, tiers } from "@/content/offerings";
import { firstSeason } from "@/content/library";
import { series } from "@/content/books";
import { articles } from "@/content/library";

// Home (PRD §7.1, as re-ruled by the design review): ten modules, at least five
// distinct layout families, one pinned-feeling moment (the shelf), one centered
// section at a time, eyebrows rationed to three across ten sections.

export default function HomePage() {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug).slice(0, 2);
  const rail = firstSeason.filter((v) => !v.locked).slice(0, 5);

  return (
    <>
      {/* 1 · Dawn Hero */}
      <HeroDawn />

      {/* 2 · Founder trust: the real face, early (design ruling D1/D2) */}
      <section aria-labelledby="founder-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-[2rem] lg:max-w-none">
              <Image
                src="/images/dr-laiyemo-portrait.jpg"
                alt="Dr. Adeyinka Laiyemo, founder of Blissful Gardenz, in a portrait photograph."
                width={900}
                height={1200}
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="h-auto w-full object-cover"
              />
              {/* Duotone grade: deep-green multiply + gold light from above */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[2rem]"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--brand) 38%, transparent), transparent 55%), linear-gradient(to bottom, color-mix(in srgb, var(--gold) 12%, transparent), transparent 40%)",
                }}
              />
            </div>
          </Reveal>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>A word from the gardener</Eyebrow>
            </Reveal>
            <Reveal>
              <h2 id="founder-title" className="text-display text-balance">
                Thirty-five years of medicine taught me where healing really begins: at home.
              </h2>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[60ch]">
                Dr. Adeyinka Laiyemo is a physician, an author, and for more than twenty years a
                quiet advocate for family harmony. Blissful Gardenz is his life&rsquo;s work made
                into a place: {brand.mission.toLowerCase()}.
              </p>
            </Reveal>
            <Reveal>
              <div className="mt-2 flex flex-col gap-4 sm:flex-row">
                <QuietButton href="/about">Our story</QuietButton>
                <QuietButton href="/about/dr-laiyemo">{ctaLabels.meetFounder}</QuietButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 · Five Pillars on the Line */}
      <section aria-labelledby="pillars-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <Reveal>
          <SectionHeading
            title={
              <span id="pillars-title">
                Five pillars. One garden.
              </span>
            }
            lede="Every conversation, film, and guide tends one of five kinds of well-being."
          />
        </Reveal>
        <div className="mt-8 md:mt-4">
          <PillarBand />
        </div>
      </section>

      {/* 4 · Conversations: asymmetric band, Rebuilding deliberately quieter */}
      <section aria-labelledby="conversations-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Harmony conversations"
              title={<span id="conversations-title">Private conversations for every season</span>}
              lede="Sixty unhurried minutes with Dr. Laiyemo, wherever your marriage is standing."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {offerings.map((offering, i) => (
              <RevealItem
                key={offering.slug}
                index={i}
                className={
                  offering.quiet
                    ? "lg:col-span-12"
                    : "lg:col-span-6"
                }
              >
                {offering.quiet ? (
                  <Link
                    href={`/conversations/${offering.slug}`}
                    className="group flex flex-col gap-2 rounded-[2rem] border border-hairline px-8 py-7 transition-colors duration-300 hover:bg-surface sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-display-sm">Not sure where to begin? Begin privately.</p>
                      <p className="text-[15px] text-ink-muted">
                        The {offering.label} path. You may come alone, and gently.
                      </p>
                    </div>
                    <span className="text-[15px] font-medium text-gold-text">
                      A quieter way in
                      <span aria-hidden className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </span>
                  </Link>
                ) : (
                  <Link href={`/conversations/${offering.slug}`} className="group block h-full">
                    <PetalCard className="h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transition-none">
                      <div className="flex h-full flex-col gap-4">
                        <p className="text-meta text-gold-text">{offering.label}</p>
                        <p className="text-display-sm">{offering.title}</p>
                        <p className="text-body flex-1 text-ink-muted">{offering.lede}</p>
                        <span className="text-[15px] font-medium text-gold-text">
                          Learn more
                          <span aria-hidden className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                            &rarr;
                          </span>
                        </span>
                      </div>
                    </PetalCard>
                  </Link>
                )}
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · The Trilogy Shelf */}
      <section aria-labelledby="trilogy-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-36 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            title={<span id="trilogy-title">{series.tagline}</span>}
            lede="The Three Guys Talking trilogy, written by Dr. Laiyemo and published under the Blissful Gardenz name."
          />
        </Reveal>
        <Reveal className="mt-16">
          <TrilogyShelf />
        </Reveal>
        <Reveal className="mt-14 flex justify-center">
          <BloomButton href="/books">Browse the trilogy</BloomButton>
        </Reveal>
      </section>

      {/* 6 · Watch & Listen rail (horizontal scroll-snap program announcement) */}
      <section aria-labelledby="watch-title" className="overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                title={<span id="watch-title">Watch &amp; Listen</span>}
                lede="The first season of garden films is in production. Here is what is coming."
              />
              <QuietButton href="/watch">See the full season</QuietButton>
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-12">
          <ul
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
            aria-label="Coming films"
          >
            {rail.map((video) => (
              <li key={video.slug} className="w-[300px] shrink-0 snap-start">
                <Link href={`/watch/${video.slug}`} className="group flex h-full flex-col gap-4">
                  <div
                    className="relative flex aspect-video items-end overflow-hidden rounded-3xl p-5"
                    style={{
                      background:
                        "linear-gradient(140deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 70%, var(--sage)) 60%, color-mix(in srgb, var(--brand) 55%, var(--gold)) 100%)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80"
                    >
                      {video.duration}
                    </span>
                    <svg
                      aria-hidden
                      viewBox="0 0 64 64"
                      className="absolute left-5 top-5 h-8 w-8 text-[#E3C25B] opacity-80"
                    >
                      <path
                        d="M32 54V30M32 30c0-10 8-16 16-16 0 10-7 16-16 16zM32 38c0-8-6-12-12-12 0 8 5 12 12 12z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <p className="relative font-[family-name:var(--font-display)] text-xl leading-tight text-[#F0EDE2]">
                      {video.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--sage)_22%,transparent)] px-2.5 py-0.5 font-medium text-ink">
                      {video.pillar}
                    </span>
                    {video.topic}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 7 · Inner Garden invitation */}
      <section aria-labelledby="garden-title" className="bg-brand text-[#F0EDE2]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Reveal>
                <Eyebrow tone="dark">The Inner Garden</Eyebrow>
              </Reveal>
              <Reveal>
                <h2 id="garden-title" className="text-display text-balance">
                  A membership two people share.
                </h2>
              </Reveal>
              <Reveal>
                <p className="text-lede max-w-[56ch] !text-white/70">
                  The full film library, guides and workbooks, a live gathering every month, and
                  the Couple Seat: one membership, two logins, because this garden is for both of
                  you.
                </p>
              </Reveal>
              <Reveal>
                <div className="mt-2 flex flex-wrap items-center gap-6">
                  <BloomButton href="/membership" tone="gold">{ctaLabels.membership}</BloomButton>
                  <Link
                    href="/membership/gift"
                    className="text-[15px] font-medium text-[#E3C25B] underline-offset-4 hover:underline"
                  >
                    Or give it as a wedding gift
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="flex flex-col gap-4">
              {/* Library peek: two tastefully veiled member films + tier snapshot */}
              <div className="grid grid-cols-2 gap-4">
                {firstSeason
                  .filter((v) => v.locked)
                  .slice(0, 2)
                  .map((video, i) => (
                    <RevealItem key={video.slug} index={i}>
                      <div
                        className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-3xl p-5"
                        style={{
                          background:
                            "linear-gradient(150deg, #152922 0%, #1C3A2E 55%, #24463A 100%)",
                        }}
                      >
                        <div aria-hidden className="absolute inset-0 backdrop-blur-[2px]" />
                        <span
                          aria-hidden
                          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#D8B23A]/20 text-[#E3C25B]"
                        >
                          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3.5" y="7" width="9" height="6" rx="1.5" />
                            <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" />
                          </svg>
                        </span>
                        <p className="relative font-[family-name:var(--font-display)] text-lg leading-tight text-[#F0EDE2]/90">
                          {video.title}
                        </p>
                        <p className="relative mt-1 text-[12px] uppercase tracking-[0.14em] text-white/50">
                          Inside the Inner Garden
                        </p>
                      </div>
                    </RevealItem>
                  ))}
              </div>
              <RevealItem index={2}>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/12 px-6 py-5">
                  {tiers.map((tier) => (
                    <div key={tier.slug} className="flex items-baseline gap-2">
                      <span className="font-[family-name:var(--font-display)] text-lg">{tier.name}</span>
                      <span className="text-[15px] text-white/60">{tier.price.monthly}/mo</span>
                    </div>
                  ))}
                  <span className="text-[13px] text-white/50">Couple Seat included in both</span>
                </div>
              </RevealItem>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · Blossom Wall */}
      <section aria-label="Member stories" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <BlossomWall />
      </section>

      {/* 9 · Journal: featured plus two */}
      <section aria-labelledby="journal-title" className="mx-auto max-w-7xl px-5 pb-24 sm:pb-32 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              title={<span id="journal-title">From the Journal</span>}
              lede="Letters and essays on tending a life together."
            />
            <QuietButton href="/journal">All writing</QuietButton>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <RevealItem index={0} className="lg:col-span-7">
            <Link href={`/journal/${featured.slug}`} className="group block h-full">
              <article className="flex h-full flex-col justify-between gap-8 rounded-[2rem] bg-brand p-10 text-[#F0EDE2]">
                <div className="flex flex-col gap-4">
                  <p className="text-meta text-[#E3C25B]">{featured.pillar}</p>
                  <h3 className="text-display text-balance group-hover:underline group-hover:decoration-[#D8B23A] group-hover:underline-offset-8">
                    {featured.title}
                  </h3>
                  <p className="text-lede max-w-[52ch] !text-white/70">{featured.excerpt}</p>
                </div>
                <p className="text-[14px] text-white/50">{featured.readMinutes} minute read</p>
              </article>
            </Link>
          </RevealItem>
          <div className="flex flex-col gap-6 lg:col-span-5">
            {rest.map((article, i) => (
              <RevealItem key={article.slug} index={i + 1}>
                <Link href={`/journal/${article.slug}`} className="group block">
                  <article className="flex flex-col gap-3 rounded-[2rem] border border-hairline p-8 transition-colors duration-300 hover:bg-raised">
                    <p className="text-meta text-gold-text">{article.pillar}</p>
                    <h3 className="text-display-sm group-hover:text-gold-text">{article.title}</h3>
                    <p className="text-[15px] leading-relaxed text-ink-muted">{article.excerpt}</p>
                    <p className="text-[13px] text-ink-muted">{article.readMinutes} minute read</p>
                  </article>
                </Link>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {/* 10 · The Founding Bloom */}
      <FoundingBloom context="home" />
    </>
  );
}
