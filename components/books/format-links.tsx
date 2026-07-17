"use client";

import { track } from "@/lib/track";
import type { Book } from "@/content/books";

// FR-04 format selector: three honest rows, each straight to the retailer in a
// new tab. Every click is counted (book_click) so the client can see which
// formats move. Client component only for the analytics handler.

export function FormatLinks({ book }: { book: Book }) {
  const rows = [
    {
      format: "Paperback",
      detail: book.formats.paperback.price,
      retailer: "Amazon",
      trackAs: "amazon",
      url: book.formats.paperback.url,
    },
    {
      format: "Kindle",
      detail: book.formats.kindle.price,
      retailer: "Amazon Kindle",
      trackAs: "kindle",
      url: book.formats.kindle.url,
    },
    {
      format: "Audiobook",
      detail: `${book.formats.audiobook.duration}, narrated by ${book.formats.audiobook.narrator}`,
      retailer: "Audible",
      trackAs: "audible",
      url: book.formats.audiobook.url,
    },
  ];

  return (
    <ul aria-label={`Where to find ${book.subtitle}`} className="border-y border-hairline">
      {rows.map((row) => (
        <li key={row.format} className="border-b border-hairline last:border-b-0">
          <a
            href={row.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("book_click", { title: book.subtitle, retailer: row.trackAs })}
            className="group flex min-h-[76px] flex-wrap items-center justify-between gap-x-6 gap-y-1 py-5 transition-colors duration-300 hover:bg-surface motion-reduce:transition-none sm:flex-nowrap sm:px-4"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-[17px] font-medium text-ink">{row.format}</span>
              <span className="text-[14px] text-ink-muted">{row.detail}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-[15px] font-medium text-gold-text">
              At {row.retailer}
              <span className="sr-only">(opens in a new tab)</span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4.5 11.5l7-7M6 4.5h5.5V10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
