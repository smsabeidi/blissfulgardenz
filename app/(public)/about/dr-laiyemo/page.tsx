import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow, SectionHeading, PetalCard } from "@/components/garden/primitives";
import { BloomButton, QuietButton } from "@/components/garden/buttons";
import { brand } from "@/content/site";
import { books, series } from "@/content/books";

export const metadata: Metadata = {
  title: "Dr. Adeyinka Laiyemo",
  description:
    "Meet the founder of Blissful Gardenz: gastroenterologist, Associate Professor of Medicine at Howard University, and author of the Three Guys Talking trilogy.",
};

// The founder page: portrait + warm biography, credentials as engraved plaque
// cards (featured + 3, never an equal 3-up), a books cross-link band, and the
// positioning statement as a PullQuote close. Four sections, one eyebrow.

const plaques = [
  {
    label: "Fellowship",
    title: "National Cancer Institute",
    line: "Postdoctoral fellowship in cancer prevention.",
  },
  {
    label: "Public health",
    title: "Johns Hopkins Bloomberg School of Public Health",
    line: "Master of Public Health.",
  },
  {
    label: "Medical degree",
    title: "University of Lagos",
    line: "MD, and the first chapter of a long life in medicine.",
  },
] as const;

function QuoteGlyph() {
  // The drawn gold quotation glyph of the PullQuote anatomy (decorative size).
  return (
    <svg aria-hidden viewBox="0 0 56 40" className="h-10 w-14 text-gold">
      <g fill="currentColor" opacity="0.9">
        <path d="M6 26c0-10 6-18 15-22l2.4 4.4C17.5 11.5 14 16 13.6 20c.5-.1 1-.2 1.6-.2 4.3 0 7.4 3.2 7.4 7.5 0 4.4-3.3 7.7-7.8 7.7C9.6 35 6 31.4 6 26z" />
        <path d="M32 26c0-10 6-18 15-22l2.4 4.4C43.5 11.5 40 16 39.6 20c.5-.1 1-.2 1.6-.2 4.3 0 7.4 3.2 7.4 7.5 0 4.4-3.3 7.7-7.8 7.7-5.2 0-8.8-3.6-8.8-9z" />
      </g>
    </svg>
  );
}

export default function DrLaiyemoPage() {
  return (
    <>
      {/* 1 · Portrait and biography */}
      <section
        aria-labelledby="founder-name"
        className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:pb-32 sm:pt-36 lg:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            {/* The portrait in the house double-bezel frame: the PetalCard
                shell, kept for an image. The real face is this page's only
                photograph. */}
            <div
              className="mx-auto max-w-sm rounded-[2rem] bg-raised p-1.5 ring-1 ring-hairline lg:max-w-none"
              style={{ boxShadow: "0 18px 50px var(--shadow-tint)" }}
            >
              <div className="relative overflow-hidden rounded-[calc(2rem-6px)]">
                <Image
                  src={brand.founder.portrait}
                  alt="Portrait of Dr. Adeyinka Laiyemo, founder of Blissful Gardenz."
                  width={900}
                  height={1125}
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="aspect-[4/5] w-full object-cover"
                  priority
                />
                {/* Duotone grade: deep-green multiply below, gold light above. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in srgb, var(--brand) 38%, transparent), transparent 55%), linear-gradient(to bottom, color-mix(in srgb, var(--gold) 12%, transparent), transparent 40%)",
                  }}
                />
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>The founder</Eyebrow>
            </Reveal>
            <Reveal>
              <h1 id="founder-name" className="text-display-xl text-balance">
                {brand.founder.name}
              </h1>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[56ch]">
                Gastroenterologist, author, and advocate for family harmony.
              </p>
            </Reveal>
            <Reveal>
              <div className="flex max-w-[58ch] flex-col gap-4">
                <p className="text-body text-ink-muted">
                  A board-certified physician with over thirty-five years in medicine, Dr. Laiyemo
                  has spent his career listening carefully to what people carry.
                </p>
                <p className="text-body text-ink-muted">
                  Alongside the medicine, two decades of family-harmony advocacy: sitting with
                  couples, writing, and speaking for the quiet work that keeps families whole.
                </p>
                <p className="text-body text-ink-muted">
                  Blissful Gardenz gathers that life&rsquo;s work into one place, a garden kept
                  for harmony conversations.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 · Credentials as engraved plaques: featured + three */}
      <section
        aria-labelledby="credentials-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8"
      >
        <HorizonDraw className="mb-14" />
        <SectionHeading
          title={<span id="credentials-title">A life in medicine</span>}
          lede="The formal record behind a familiar voice."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <RevealItem index={0} className="lg:col-span-5">
            <PetalCard className="h-full" innerClassName="flex h-full flex-col gap-4">
              <p className="text-meta text-gold-text">Present appointment</p>
              <h3 className="text-display-sm text-balance">Associate Professor of Medicine</h3>
              <p className="text-body text-ink-muted">
                Howard University College of Medicine, where he has taught since 2010.
              </p>
              <div aria-hidden className="mt-auto h-px w-full bg-hairline" />
              <p className="text-[15px] text-ink-muted">
                Board-certified physician with over thirty-five years in medicine.
              </p>
            </PetalCard>
          </RevealItem>
          <div className="flex flex-col gap-6 lg:col-span-7">
            {plaques.map((plaque, i) => (
              <RevealItem key={plaque.title} index={i + 1}>
                <PetalCard innerClassName="flex flex-col gap-2">
                  <p className="text-meta text-gold-text">{plaque.label}</p>
                  <h3 className="text-display-sm text-balance">{plaque.title}</h3>
                  <p className="text-body text-ink-muted">{plaque.line}</p>
                </PetalCard>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · The trilogy cross-link band */}
      <section aria-labelledby="author-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-6">
              <Reveal>
                <h2 id="author-title" className="text-display text-balance">
                  Author of the Three Guys Talking trilogy
                </h2>
              </Reveal>
              <Reveal>
                <p className="text-lede max-w-[52ch]">{series.tagline}</p>
              </Reveal>
              <Reveal>
                <p className="text-[15px] text-ink-muted">
                  Published under Blissful Gardenz Inc between 2017 and 2020.
                </p>
              </Reveal>
              <Reveal>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row">
                  <BloomButton href="/books">Browse the trilogy</BloomButton>
                  <QuietButton href={brand.founder.amazonAuthorUrl} external>
                    His author page
                  </QuietButton>
                </div>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-6">
              <div className="flex items-end justify-center">
                {books.map((book) => (
                  <Image
                    key={book.slug}
                    src={book.cover}
                    alt={book.coverAlt}
                    width={313}
                    height={500}
                    sizes="(max-width: 640px) 34vw, 170px"
                    className={`h-auto w-[104px] rounded-md sm:w-[150px] lg:w-[170px] ${
                      book.order === 1
                        ? "-rotate-6"
                        : book.order === 2
                          ? "z-10 -translate-y-3"
                          : "rotate-6"
                    } ${book.order !== 1 ? "-ml-5" : ""}`}
                    style={{ boxShadow: "0 24px 60px var(--shadow-tint)" }}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 · The positioning statement, as a PullQuote */}
      <section
        aria-label="A word from the founder"
        className="mx-auto max-w-7xl px-5 py-24 sm:py-36 lg:px-8"
      >
        <Reveal>
          <figure className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <QuoteGlyph />
            <blockquote className="text-display-sm italic text-balance">
              For couples at every stage, engaged, married, and rebuilding, Blissful Gardenz is
              the trusted garden where relationships are tended.
            </blockquote>
            <figcaption className="text-meta text-ink-muted">
              {brand.founder.name} · Founder, {brand.name}
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </>
  );
}
