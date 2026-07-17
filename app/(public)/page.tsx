import Image from "next/image";
import Link from "next/link";
import { HeroDawn } from "@/components/home/hero-dawn";
import { PillarBand } from "@/components/home/pillar-band";
import { TrilogyShelf } from "@/components/home/trilogy-shelf";
import { BlossomWall } from "@/components/home/blossom-wall";
import { FoundingBloom } from "@/components/home/founding-bloom";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { WatchCard, PosterFrame } from "@/components/watch/poster";
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
              <li key={video.slug} className="w-[320px] shrink-0 snap-start">
                <WatchCard video={video} />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 7 · Inner Garden invitation */}
      <section aria-labelledby="garden-title" className="bg-brand text-[#F3E9DE]">
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
                    className="text-[15px] font-medium text-[#EFC66B] underline-offset-4 hover:underline"
                  >
                    Or give it as a wedding gift
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="flex flex-col gap-4">
              {/* Library peek: two tastefully veiled member films + tier snapshot */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {firstSeason
                  .filter((v) => v.locked)
                  .slice(0, 2)
                  .map((video, i) => (
                    <RevealItem key={video.slug} index={i}>
                      <PosterFrame video={video} />
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
              <article className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[2rem] bg-brand p-10 text-[#F3E9DE]">
                <Image
                  src="/images/photos/couple-path.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 640px"
                  className="object-cover opacity-40 mix-blend-luminosity transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(37,26,29,0.72) 10%, rgba(37,26,29,0.25) 60%, rgba(37,26,29,0.15) 100%)",
                  }}
                />
                <div className="relative flex flex-col gap-4">
                  <p className="text-meta text-[#EFC66B]">{featured.pillar}</p>
                  <h3 className="text-display text-balance group-hover:underline group-hover:decoration-[#E3B04B] group-hover:underline-offset-8">
                    {featured.title}
                  </h3>
                  <p className="text-lede max-w-[52ch] !text-white/80">{featured.excerpt}</p>
                </div>
                <p className="relative text-[14px] text-white/60">{featured.readMinutes} minute read</p>
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
