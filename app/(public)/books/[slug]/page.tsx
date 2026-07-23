import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/books/book-cover";
import { FormatLinks } from "@/components/books/format-links";
import { SamplePlayer } from "@/components/books/sample-player";
import { Reveal, HorizonDraw } from "@/components/garden/reveal";
import { SectionHeading, PetalCard } from "@/components/garden/primitives";
import { QuietButton } from "@/components/garden/buttons";
import { books, getBook } from "@/content/books";
import { ctaLabels } from "@/content/site";

// Book detail: cover, synopsis, format selector (FR-04), the sample player in
// its designed disabled state, the reception line, the companion-guide funnel,
// and prev/next along the reading order. All facts from content/books.ts.

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "Book not found" };
  return {
    title: `${book.subtitle} · ${book.title}`,
    description: `Book ${book.order} of the Three Guys Talking trilogy by Dr. Adeyinka Laiyemo. ${book.pages} pages, published ${book.publishedYear}. In paperback, Kindle, and audiobook.`,
  };
}

export default async function BookDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const prev = books.find((b) => b.order === book.order - 1);
  const next = books.find((b) => b.order === book.order + 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: `${book.title}: ${book.subtitle}`,
    isbn: book.isbn13,
    numberOfPages: book.pages,
    datePublished: String(book.publishedYear),
    inLanguage: "en",
    image: `https://blissfulgardenz.com${book.cover}`,
    author: { "@type": "Person", name: "Adeyinka Laiyemo" },
    publisher: { "@type": "Organization", name: "Blissful Gardenz Inc" },
    offers: [
      {
        "@type": "Offer",
        price: book.formats.paperback.price.replace("$", ""),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: book.formats.paperback.url,
      },
      {
        "@type": "Offer",
        price: book.formats.kindle.price.replace("$", ""),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: book.formats.kindle.url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1 · Cover + synopsis */}
      <section
        aria-labelledby="book-title"
        className="mx-auto max-w-7xl px-5 py-24 sm:pt-28 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Reveal>
                <BookCover book={book} />
              </Reveal>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
            <Reveal>
              <p className="text-meta text-gold-text">
                Book {book.order} of 3 · {book.publishedYear}, {book.pages} pages
              </p>
            </Reveal>
            <Reveal>
              <h1 id="book-title" className="text-display-xl max-w-3xl text-balance">
                {book.subtitle}
              </h1>
            </Reveal>
            <div className="flex flex-col gap-5">
              {book.synopsis.map((paragraph) => (
                <Reveal key={paragraph.slice(0, 24)}>
                  <p className="text-body max-w-[62ch] text-ink-muted">{paragraph}</p>
                </Reveal>
              ))}
            </div>
            {/* Reception: the real rating note and reader themes, one calm sentence row */}
            <Reveal>
              <div className="mt-4 flex items-start gap-3 border-t border-hairline pt-6">
                <svg aria-hidden viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-gold">
                  <path
                    d="M8 1.5l1.9 4.1 4.5.5-3.3 3 .9 4.4L8 11.3l-4 2.2.9-4.4-3.3-3 4.5-.5z"
                    fill="currentColor"
                  />
                </svg>
                <p className="text-[15px] leading-relaxed text-ink-muted">
                  {book.rating.note}. {book.themes}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 · Formats (FR-04) + audiobook sample */}
      <section aria-labelledby="formats-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-28 lg:px-8">
          <SectionHeading
            title={<span id="formats-title">Bring this book home</span>}
            lede="Choose the format that suits your evenings. Every link below opens the retailer in a new tab."
          />
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <FormatLinks book={book} />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <SamplePlayer book={book} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 · Go deeper: the companion-guide funnel */}
      <section aria-labelledby="deeper-title" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <PetalCard>
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3">
                <h2 id="deeper-title" className="text-display-sm">
                  Go deeper than the last page
                </h2>
                <p className="text-body max-w-[52ch] text-ink-muted">
                  Every book has a members-only Companion Conversation Guide, included in the Inner
                  Garden.
                </p>
              </div>
              <QuietButton href="/membership">{ctaLabels.membership}</QuietButton>
            </div>
          </PetalCard>
        </Reveal>
      </section>

      {/* 4 · The trilogy in reading order */}
      <nav
        aria-label="The trilogy in reading order"
        className="mx-auto max-w-7xl px-5 pb-24 lg:px-8"
      >
        <HorizonDraw className="mb-10" />
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {prev ? (
            <Link href={`/books/${prev.slug}`} className="group flex flex-col gap-1">
              <span className="text-meta text-gold-text">Previous · Book {prev.order}</span>
              <span className="text-display-sm max-w-[24ch] text-balance transition-colors duration-300 group-hover:text-gold-text motion-reduce:transition-none">
                {prev.subtitle}
              </span>
            </Link>
          ) : (
            <Link href="/books" className="group flex flex-col gap-1">
              <span className="text-meta text-gold-text">The beginning</span>
              <span className="text-display-sm transition-colors duration-300 group-hover:text-gold-text motion-reduce:transition-none">
                Browse the trilogy
              </span>
            </Link>
          )}
          {next ? (
            <Link
              href={`/books/${next.slug}`}
              className="group flex flex-col gap-1 sm:items-end sm:text-right"
            >
              <span className="text-meta text-gold-text">Next · Book {next.order}</span>
              <span className="text-display-sm max-w-[24ch] text-balance transition-colors duration-300 group-hover:text-gold-text motion-reduce:transition-none">
                {next.subtitle}
              </span>
            </Link>
          ) : (
            <Link href="/books" className="group flex flex-col gap-1 sm:items-end sm:text-right">
              <span className="text-meta text-gold-text">The conversation continues</span>
              <span className="text-display-sm transition-colors duration-300 group-hover:text-gold-text motion-reduce:transition-none">
                Browse the trilogy
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
