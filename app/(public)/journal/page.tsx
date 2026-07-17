import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealItem } from "@/components/garden/reveal";
import { Eyebrow } from "@/components/garden/primitives";
import { articles } from "@/content/library";

// Journal index (PRD §7.7): editorial, not a blog grid. One featured letter as
// a full-width brand-dark card (same idiom as Home module 9), the remaining
// letters as an asymmetric pair of bordered rows. Redesign pass: the featured
// card carries the couple-path photograph as a luminosity-blended duotone
// backdrop under a scrim (same technique as the Home featured card).
// FilterChips skipped on purpose: three articles do not need a filter
// (considered emptiness beats empty controls).

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Letters and essays from Dr. Adeyinka Laiyemo on tending a life together: money, family, listening, and the five pillars of harmony.",
};

export default function JournalPage() {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug);

  return (
    <section aria-labelledby="journal-title" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
      <Reveal>
        <header className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>Letters from the garden</Eyebrow>
          <h1 id="journal-title" className="text-display-xl text-balance">
            The Journal
          </h1>
          <p className="text-lede max-w-[60ch]">
            Letters and essays on tending a life together, written in Dr. Laiyemo&rsquo;s own hand.
          </p>
          <p className="text-[14px] text-ink-muted">A new letter is planted every month.</p>
        </header>
      </Reveal>

      {/* Featured letter: full-width dusk card */}
      <Reveal className="mt-14">
        <Link href={`/journal/${featured.slug}`} className="group block">
          <article className="relative grid grid-cols-1 gap-8 overflow-hidden rounded-[2rem] bg-brand p-8 text-[#F0EDE2] sm:p-12 lg:grid-cols-12 lg:items-end">
            <Image
              src="/images/photos/couple-path.jpg"
              alt=""
              fill
              sizes="(max-width: 1280px) 92vw, 1216px"
              className="object-cover opacity-40 mix-blend-luminosity transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            {/* Depth floor: text over imagery always gets a scrim (DESIGN.md) */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,21,18,0.72) 10%, rgba(11,21,18,0.25) 60%, rgba(11,21,18,0.15) 100%)",
              }}
            />
            <div className="relative flex flex-col gap-4 lg:col-span-7">
              <p className="text-meta text-[#E3C25B]">{featured.pillar}</p>
              <h2 className="text-display text-balance group-hover:underline group-hover:decoration-[#D8B23A] group-hover:underline-offset-8">
                {featured.title}
              </h2>
            </div>
            <div className="relative flex flex-col gap-6 lg:col-span-5">
              <p className="text-lede max-w-[52ch] !text-white/80">{featured.excerpt}</p>
              <p className="flex items-center gap-4 text-[14px] text-white/60">
                {featured.readMinutes} minute read
                <span className="font-medium text-[#E3C25B]">
                  Read the letter
                  <span
                    aria-hidden
                    className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </p>
            </div>
          </article>
        </Link>
      </Reveal>

      {/* Remaining letters: asymmetric pair of bordered rows */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {rest.map((article, i) => (
          <RevealItem key={article.slug} index={i + 1} className={i === 0 ? "lg:col-span-7" : "lg:col-span-5"}>
            <Link href={`/journal/${article.slug}`} className="group block h-full">
              <article className="flex h-full flex-col gap-3 rounded-[2rem] border border-hairline p-8 transition-colors duration-300 hover:bg-raised">
                <p className="text-meta text-gold-text">{article.pillar}</p>
                <h2 className="text-display-sm text-balance group-hover:text-gold-text">{article.title}</h2>
                <p className="text-[15px] leading-relaxed text-ink-muted">{article.excerpt}</p>
                <p className="mt-auto pt-2 text-[13px] text-ink-muted">{article.readMinutes} minute read</p>
              </article>
            </Link>
          </RevealItem>
        ))}
      </div>
    </section>
  );
}
