import type { Metadata } from "next";
import Link from "next/link";
import { TrilogyShelf } from "@/components/home/trilogy-shelf";
import { BookBand } from "@/components/books/book-band";
import { Reveal, HorizonDraw } from "@/components/garden/reveal";
import { Eyebrow } from "@/components/garden/primitives";
import { books, series } from "@/content/books";

// /books hub: the trilogy on its shelf, the story behind it, the reading
// order, then one full-width band per book. Layout families: centered hero,
// left-asymmetric split, bordered strip, alternating bands (band two mirrored
// so no more than two share a pattern).

export const metadata: Metadata = {
  title: "The Three Guys Talking Trilogy",
  description:
    "The Three Guys Talking trilogy by Dr. Adeyinka Laiyemo: three seriocomic novels about marriage, fatherhood, and second chances, in paperback, Kindle, and audiobook.",
};

export default function BooksPage() {
  return (
    <>
      {/* 1 · The shelf, front and center */}
      <section
        aria-labelledby="trilogy-hero-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:pt-32 lg:px-8"
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <Reveal>
            <Eyebrow>The trilogy</Eyebrow>
          </Reveal>
          <Reveal>
            <h1 id="trilogy-hero-title" className="text-display-xl max-w-5xl text-balance">
              {series.tagline}
            </h1>
          </Reveal>
          <Reveal>
            <p className="text-lede max-w-[60ch]">
              The Three Guys Talking trilogy, in paperback, Kindle, and audiobook. Begin with book
              one and follow the conversation home.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-16">
          <TrilogyShelf />
        </Reveal>
      </section>

      {/* 2 · The story behind the trilogy + reading order */}
      <section aria-labelledby="story-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <HorizonDraw className="mb-14" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 id="story-title" className="text-display max-w-md text-balance">
                The story behind the trilogy
              </h2>
            </Reveal>
            <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="text-lede max-w-[62ch]">{series.description}</p>
              </Reveal>
              <Reveal>
                <p className="text-body max-w-[62ch] text-ink-muted">
                  Dr. Adeyinka Laiyemo published the novels between 2017 and 2020. In the
                  audiobooks, one narrator, Drew Alan Baker, carries all three.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal className="mt-16">
            <div className="flex flex-col gap-8 rounded-[2rem] border border-hairline bg-surface px-8 py-8 md:flex-row md:items-center md:justify-between">
              <p className="text-display-sm max-w-[26ch] text-balance">{series.readingOrderNote}</p>
              <ol aria-label="Reading order" className="flex flex-col gap-3">
                {books.map((book) => (
                  <li key={book.slug} className="flex items-baseline gap-4">
                    <span
                      aria-hidden
                      className="w-4 text-right font-[family-name:var(--font-display)] text-lg text-gold-text"
                    >
                      {book.order}
                    </span>
                    <Link
                      href={`/books/${book.slug}`}
                      className="text-[15px] font-medium underline-offset-4 transition-colors duration-300 hover:text-gold-text hover:underline motion-reduce:transition-none"
                    >
                      {book.subtitle}
                    </Link>
                    <span className="text-[13px] text-ink-muted">{book.publishedYear}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3-5 · One band per book, alternating composition */}
      {books.map((book, i) => (
        <section
          key={book.slug}
          aria-labelledby={`band-title-${book.order}`}
          className={i === 1 ? "bg-raised" : undefined}
        >
          <div className="py-24 sm:py-28">
            <BookBand book={book} headingId={`band-title-${book.order}`} flip={i === 1} />
          </div>
        </section>
      ))}
    </>
  );
}
