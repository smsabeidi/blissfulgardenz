import type { Metadata } from "next";
import { Reveal, HorizonDraw } from "@/components/garden/reveal";
import { WatchGrid } from "@/components/watch/watch-grid";

// Watch & Listen: an honest program announcement (design ruling D10). The
// first season is in production; poster cards carry the real planned films.
// No fake play behavior anywhere on this route.

export const metadata: Metadata = {
  title: "Watch & Listen",
  description:
    "The first season of Blissful Gardenz garden films is in production: honest short films on communication, money, family, rest, and repair. The free films arrive when the Garden opens.",
};

export default function WatchPage() {
  return (
    <>
      <section aria-labelledby="watch-title" className="mx-auto max-w-7xl px-5 pt-36 sm:pt-44 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-4">
            {/* The one sanctioned middle dot on this page: status metadata. */}
            <p className="text-meta text-gold-text">First season &middot; in production</p>
            <h1 id="watch-title" className="text-display-xl max-w-4xl text-balance">
              Watch &amp; Listen
            </h1>
            <p className="text-lede max-w-[65ch]">
              The first season of garden films is in production. The free films arrive when the
              Garden opens.
            </p>
          </div>
        </Reveal>
        <HorizonDraw className="mt-14" />
      </section>

      <section aria-label="The first season" className="mx-auto max-w-7xl px-5 pb-24 pt-14 sm:pb-36 lg:px-8">
        <WatchGrid />
      </section>
    </>
  );
}
