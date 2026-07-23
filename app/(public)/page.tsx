import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import { HeroScroll } from "@/components/home/hero-scroll";
import { PillarBand } from "@/components/home/pillar-band";
import { TrilogyShelf } from "@/components/home/trilogy-shelf";
import { BlossomWall } from "@/components/home/blossom-wall";
import { FoundingBloom } from "@/components/home/founding-bloom";
import { Reveal, RevealItem } from "@/components/garden/reveal";
import { ImageUnveil, Magnetic, MaskRise } from "@/components/garden/motion-reveals";
import { SunBand } from "@/components/garden/sun-band";
import { CursorGlow } from "@/components/garden/cursor-glow";
import { TiltCard } from "@/components/garden/tilt-card";
import { DepthField, DepthLayer } from "@/components/garden/depth-field";
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

  // The scroll-scrubbed hero flight. hero-garden.mp4 is the 720p all-keyframe
  // encode (every frame seekable, so scrubbing is instant); the mobile encode
  // is the loop fallback for touch devices.
  const heroFilm = "/videos/hero-garden.mp4";
  const videoSrc = existsSync(join(process.cwd(), "public", heroFilm)) ? heroFilm : null;
  const heroFilmMobile = "/videos/hero-garden-mobile.mp4";
  const videoSrcMobile = existsSync(join(process.cwd(), "public", heroFilmMobile))
    ? heroFilmMobile
    : null;

  // Same contract for the golden interlude: the still upgrades to a
  // scroll-scrubbed film the moment the encoded band is dropped in (video
  // generation requires a paid Higgsfield plan; the still ships today).
  const bandFilmPath = "/videos/garden-band.mp4";
  const bandFilm = existsSync(join(process.cwd(), "public", bandFilmPath)) ? bandFilmPath : null;

  return (
    <>
      {/* 1 · The Garden Film hero: pinned, scroll-scrubbed cinematic flight */}
      <HeroScroll videoSrc={videoSrc} videoSrcMobile={videoSrcMobile} />

      {/* 2 · Founder trust: the real face, early (design ruling D1/D2) */}
      <section aria-labelledby="founder-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <ImageUnveil className="rounded-[2rem] lg:col-span-5">
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
          </ImageUnveil>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>A word from the gardener</Eyebrow>
            </Reveal>
            <h2 id="founder-title" className="text-display text-balance">
              <MaskRise delay={0.1}>
                Thirty-five years of medicine taught me where healing really begins: at home.
              </MaskRise>
            </h2>
            <Reveal delay={0.2}>
              <p className="text-lede max-w-[60ch]">
                Dr. Adeyinka Laiyemo is a physician, an author, and for more than twenty years a
                quiet advocate for family harmony. Blissful Gardenz is his life&rsquo;s work made
                into a place: {brand.mission.toLowerCase()}.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
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
        <SectionHeading
          title={
            <span id="pillars-title">
              Five pillars. One garden.
            </span>
          }
          lede="Every conversation, film, and guide tends one of five kinds of well-being."
        />
        <div className="mt-8 md:mt-4">
          <PillarBand />
        </div>
      </section>

      {/* 4 · Conversations: asymmetric band, Rebuilding deliberately quieter */}
      <section aria-labelledby="conversations-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <SectionHeading
            eyebrow="Harmony conversations"
            title={<span id="conversations-title">Private conversations for every season</span>}
            lede="Sixty unhurried minutes with Dr. Laiyemo, wherever your marriage is standing."
          />
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
                    <TiltCard className="h-full">
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
                    </TiltCard>
                  </Link>
                )}
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · The Trilogy Shelf */}
      <section aria-labelledby="trilogy-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-36 lg:px-8">
        <SectionHeading
          align="center"
          title={<span id="trilogy-title">{series.tagline}</span>}
          lede="The Three Guys Talking trilogy, written by Dr. Laiyemo and published under the Blissful Gardenz name."
        />
        <Reveal className="mt-16">
          <TrilogyShelf />
        </Reveal>
        <Reveal className="mt-14 flex justify-center">
          <Magnetic>
            <BloomButton href="/books">Browse the trilogy</BloomButton>
          </Magnetic>
        </Reveal>
      </section>

      {/* 6 · Watch & Listen rail (horizontal scroll-snap program announcement) */}
      <section aria-labelledby="watch-title" className="overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              title={<span id="watch-title">Watch &amp; Listen</span>}
              lede="The first season of garden films is in production. Here is what is coming."
            />
            <Reveal delay={0.2}>
              <QuietButton href="/watch">See the full season</QuietButton>
            </Reveal>
          </div>
        </div>
        {/* Cards enter as a 70ms cascade, not one monolithic block, and the
            rail contains its own overscroll so trackpad momentum never
            triggers browser back/forward navigation. */}
        <ul
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-5 pb-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          aria-label="Coming films"
        >
          {rail.map((video, i) => (
            <li key={video.slug} className="w-[320px] shrink-0 snap-start">
              <RevealItem index={i}>
                <WatchCard video={video} />
              </RevealItem>
            </li>
          ))}
        </ul>
      </section>

      {/* 6.5 · Golden interlude: the light the Inner Garden keeps. The still
             upgrades to a scroll-scrubbed film when the band is generated. */}
      <SunBand
        image="/images/photos/sun-grasses.jpg"
        alt="Tall backlit grasses glowing before an enormous golden-hour sun."
        videoSrc={bandFilm}
        title={
          <>
            Stay for the <em className="font-[420] italic text-[#e4ce7f]">golden hour</em>.
          </>
        }
        meta="The garden after six"
      />

      {/* 7 · Inner Garden invitation: a true-perspective dusk scene. The
             lantern photograph sits behind the page plane, the leaf-light
             macro floats in front, and the whole scene answers both scroll
             and cursor (DepthField). The plum scrim keeps every line AA. */}
      <section
        aria-labelledby="garden-title"
        data-ground="dark"
        className="relative overflow-hidden bg-brand text-brand-ink"
      >
        <DepthField className="relative">
          <DepthLayer depth={-140} className="absolute inset-[-9%]">
            <Image
              src="/images/photos/inner-garden-dusk.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-60"
            />
          </DepthLayer>
          <DepthLayer
            depth={90}
            className="pointer-events-none absolute -right-28 -top-24 hidden aspect-video w-[44rem] opacity-30 mix-blend-screen lg:block"
          >
            <Image
              src="/images/photos/leaf-light-macro.jpg"
              alt=""
              fill
              sizes="44rem"
              className="rounded-[3rem] object-cover"
            />
          </DepthLayer>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(42,30,33,0.58) 0%, rgba(42,30,33,0.44) 45%, rgba(42,30,33,0.74) 100%)",
            }}
          />
          <CursorGlow />
          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Reveal>
                <Eyebrow tone="dark">The Inner Garden</Eyebrow>
              </Reveal>
              <h2 id="garden-title" className="text-display text-balance">
                <MaskRise delay={0.1}>A membership two people share.</MaskRise>
              </h2>
              <Reveal>
                <p className="text-lede max-w-[56ch] !text-brand-ink-muted">
                  The full film library, guides and workbooks, a live gathering every month, and
                  the Couple Seat: one membership, two logins, because this garden is for both of
                  you.
                </p>
              </Reveal>
              <Reveal>
                <div className="mt-2 flex flex-wrap items-center gap-6">
                  <Magnetic>
                    <BloomButton href="/membership" tone="gold">{ctaLabels.membership}</BloomButton>
                  </Magnetic>
                  <Link
                    href="/membership/gift"
                    className="text-[15px] font-medium text-[#e3c25b] underline-offset-4 hover:underline"
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
                      <span className="text-[15px] text-brand-ink-muted/80">{tier.price.monthly}/mo</span>
                    </div>
                  ))}
                  <span className="text-[13px] text-brand-ink-muted/70">Couple Seat included in both</span>
                </div>
              </RevealItem>
            </div>
          </div>
          </div>
        </DepthField>
      </section>

      {/* 8 · Blossom Wall */}
      <section aria-label="Member stories" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
        <BlossomWall />
      </section>

      {/* 9 · Journal: featured plus two */}
      <section aria-labelledby="journal-title" className="mx-auto max-w-7xl px-5 pb-24 sm:pb-32 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title={<span id="journal-title">From the Journal</span>}
            lede="Letters and essays on tending a life together."
          />
          <Reveal delay={0.2}>
            <QuietButton href="/journal">All writing</QuietButton>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <RevealItem index={0} className="lg:col-span-7">
            <Link href={`/journal/${featured.slug}`} className="group block h-full">
              <article className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[2rem] bg-brand p-10 text-brand-ink">
                <Image
                  src="/images/photos/couple-path-gold.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 640px"
                  className="object-cover opacity-55 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11, 31, 22,0.72) 10%, rgba(11, 31, 22,0.25) 60%, rgba(11, 31, 22,0.15) 100%)",
                  }}
                />
                <div className="relative flex flex-col gap-4">
                  <p className="text-meta text-[#e3c25b]">{featured.pillar}</p>
                  <h3 className="text-display text-balance group-hover:underline group-hover:decoration-[#c9a227] group-hover:underline-offset-8">
                    {featured.title}
                  </h3>
                  <p className="text-lede max-w-[52ch] !text-brand-ink-muted">{featured.excerpt}</p>
                </div>
                <p className="relative text-[14px] text-brand-ink-muted/80">{featured.readMinutes} minute read</p>
              </article>
            </Link>
          </RevealItem>
          <div className="flex flex-col gap-6 lg:col-span-5">
            {rest.map((article, i) => (
              <RevealItem key={article.slug} index={i + 1}>
                <Link href={`/journal/${article.slug}`} className="group block">
                  <article className="flex flex-col gap-3 rounded-[2rem] border border-hairline p-8 transition-colors duration-300 hover:bg-raised">
                    <p className="text-meta text-gold-text">{article.pillar}</p>
                    <h3 className="text-display-sm transition-colors duration-200 group-hover:text-gold-text">
                      {article.title}
                    </h3>
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
