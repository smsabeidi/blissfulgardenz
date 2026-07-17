import Image from "next/image";
import type { Book } from "@/content/books";

// Large detail-page cover. The 3D is CSS only and hover only: a gentle
// perspective tilt, as if the book were lifted from the shelf. Motivation:
// feedback (the object responds like a held book). Reduced motion: no tilt,
// no transition, the cover simply sits.
export function BookCover({ book }: { book: Book }) {
  return (
    <div className="group mx-auto w-full max-w-[313px]" style={{ perspective: "1100px" }}>
      <div
        className="relative transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateY(-7deg)_rotateX(2.5deg)_translateY(-4px)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Spine edge for depth, matching the Trilogy Shelf anatomy */}
        <div
          aria-hidden
          className="absolute -left-2.5 top-1.5 h-[calc(100%-3px)] w-2.5 rounded-l-sm bg-brand"
          style={{ transform: "rotateY(-45deg) translateZ(-1px)", transformOrigin: "right" }}
        />
        <Image
          src={book.cover}
          alt={book.coverAlt}
          width={313}
          height={500}
          sizes="(max-width: 1024px) 80vw, 313px"
          priority
          className="h-auto w-full rounded-md"
          style={{ boxShadow: "0 24px 60px var(--shadow-tint)" }}
        />
      </div>
    </div>
  );
}
