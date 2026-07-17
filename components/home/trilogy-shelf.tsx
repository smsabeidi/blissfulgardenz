"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { books } from "@/content/books";
import { track } from "@/lib/track";

// The Trilogy Shelf: real covers on a CSS 3D shelf with pointer tilt and
// keyboard-accessible book selection. The 3D is CSS transforms + GSAP-free
// pointer math via motion values kept out of React state; a static fallback
// serves reduced-motion and touch. (React Three Fiber deferred post-approval.)
//
// Keyboard path: each book is a real link (to its detail page); arrow keys move
// focus along the shelf; tilt is pointer-only sugar, never required.

export function TrilogyShelf() {
  const shelf = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Pointer tilt: writes transforms directly to DOM nodes (no React state per
  // frame). Capped at 7deg so covers stay readable.
  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType === "touch" || !shelf.current) return;
      const rect = shelf.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        shelf.current?.querySelectorAll<HTMLElement>("[data-book]").forEach((el, i) => {
          const depth = 1 - Math.abs(i - 1) * 0.15;
          el.style.transform = `rotateY(${px * 14 * depth}deg) rotateX(${-py * 7 * depth}deg)`;
        });
      });
    },
    [reduce]
  );

  const onLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    shelf.current?.querySelectorAll<HTMLElement>("[data-book]").forEach((el) => {
      el.style.transform = "";
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const links = Array.from(shelf.current?.querySelectorAll<HTMLElement>("a[data-book-link]") ?? []);
    const idx = links.indexOf(document.activeElement as HTMLElement);
    if (idx === -1) return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? Math.min(idx + 1, links.length - 1) : Math.max(idx - 1, 0);
    links[next].focus();
  }, []);

  return (
    <div
      ref={shelf}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onKeyDown={onKey}
      role="list"
      aria-label="The Three Guys Talking trilogy, in reading order"
      className="mx-auto grid max-w-4xl grid-cols-1 items-end gap-12 sm:grid-cols-3 sm:gap-8"
      style={{ perspective: "1200px" }}
    >
      {books.map((book) => (
        <div key={book.slug} role="listitem" className="flex flex-col items-center gap-5">
          <div
            data-book
            className="relative transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Spine edge for depth */}
            <div
              aria-hidden
              className="absolute -left-2.5 top-1.5 h-[calc(100%-3px)] w-2.5 rounded-l-sm bg-brand"
              style={{ transform: "rotateY(-45deg) translateZ(-1px)", transformOrigin: "right" }}
            />
            <Link
              data-book-link
              href={`/books/${book.slug}`}
              onClick={() => track("book_click", { title: book.subtitle, retailer: "detail" })}
              className="group block overflow-hidden rounded-md"
              aria-label={`${book.title}: ${book.subtitle}, book ${book.order}`}
            >
              <Image
                src={book.cover}
                alt={book.coverAlt}
                width={313}
                height={500}
                sizes="(max-width: 640px) 70vw, 260px"
                className="h-auto w-[210px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none sm:w-full"
                style={{ boxShadow: "0 24px 60px var(--shadow-tint)" }}
                priority={book.order === 1}
              />
            </Link>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-meta text-gold-text">Book {book.order}</p>
            <p className="text-display-sm max-w-[26ch] text-balance">{book.subtitle}</p>
            <p className="text-[14px] text-ink-muted">
              {book.publishedYear} · {book.formats.audiobook.duration} listen
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
