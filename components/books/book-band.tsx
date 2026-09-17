import Image from "next/image";
import Link from "next/link";
import { QuietButton } from "@/components/garden/buttons";
import { Reveal } from "@/components/garden/reveal";
import { getBookDisplayTitle, getBookFullTitle, type Book } from "@/content/books";

// Hub band: one full-width composition per book, cover and words in an
// asymmetric split. `flip` mirrors the composition so the shelf page never
// reads as a repeated template (max two bands share a pattern).

export function BookBand({
  book,
  headingId,
  flip = false,
}: {
  book: Book;
  headingId: string;
  flip?: boolean;
}) {
  const displayTitle = getBookDisplayTitle(book);
  const fullTitle = getBookFullTitle(book);
  const bookLabel =
    book.collection === "trilogy" ? `Book ${book.order}` : "Standalone novel";

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-12 lg:gap-8 lg:px-8">
      <Reveal
        className={flip ? "lg:col-span-4 lg:col-start-9 lg:row-start-1" : "lg:col-span-4 lg:col-start-1"}
      >
        <Link
          href={`/books/${book.slug}`}
          aria-label={
            book.collection === "trilogy"
              ? `${fullTitle}, book ${book.order} of the trilogy`
              : fullTitle
          }
          className="group mx-auto block w-full max-w-[260px]"
        >
          <Image
            src={book.cover}
            alt={book.coverAlt}
            width={313}
            height={500}
            sizes="(max-width: 1024px) 60vw, 260px"
            className="h-auto w-full rounded-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
            style={{ boxShadow: "0 24px 60px var(--shadow-tint)" }}
          />
        </Link>
      </Reveal>
      <div
        className={`flex flex-col gap-5 ${
          flip ? "lg:col-span-7 lg:col-start-1 lg:row-start-1" : "lg:col-span-7 lg:col-start-6"
        }`}
      >
        <Reveal>
          <p className="text-meta text-gold-text">
            {bookLabel} · {book.publishedYear} · {book.pages} pages
          </p>
        </Reveal>
        <Reveal>
          <h2 id={headingId} className="text-display max-w-3xl text-balance">
            {displayTitle}
          </h2>
        </Reveal>
        {book.collection === "standalone" && (
          <Reveal>
            <p className="text-display-sm text-ink-muted">{book.subtitle}</p>
          </Reveal>
        )}
        <Reveal>
          <p className="text-body max-w-[58ch] text-ink-muted">{book.synopsis[0]}</p>
        </Reveal>
        <Reveal>
          <div className="mt-2">
            <QuietButton href={`/books/${book.slug}`}>About this book</QuietButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
