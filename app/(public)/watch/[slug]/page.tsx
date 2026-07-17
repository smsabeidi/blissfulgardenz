import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { firstSeason, getVideo } from "@/content/library";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { SectionHeading } from "@/components/garden/primitives";
import { NewsletterForm } from "@/components/garden/newsletter-form";
import { PosterFrame, WatchCard } from "@/components/watch/poster";

// Film detail: statically generated for unlocked films only. Locked slugs are
// never generated and 404 (their cards route to /membership instead, D6).
// The page is honest about production status; no fake play behavior (D10).

export const dynamicParams = false;

export function generateStaticParams() {
  return firstSeason.filter((v) => !v.locked).map((v) => ({ slug: v.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video || video.locked) {
    return { title: "Watch & Listen" };
  }
  return {
    title: video.title,
    description: `${video.description} A ${video.duration} film from the first season of garden films, now in production.`,
  };
}

export default async function WatchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video || video.locked) notFound();

  const rest = firstSeason.filter((v) => !v.locked && v.slug !== video.slug);
  const related = [
    ...rest.filter((v) => v.pillar === video.pillar),
    ...rest.filter((v) => v.pillar !== video.pillar),
  ].slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:pb-32 sm:pt-44 lg:px-8">
        <Reveal>
          <Link
            href="/watch"
            className="group inline-flex items-center gap-2 text-[15px] font-medium text-gold-text"
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none"
            >
              &larr;
            </span>
            The full season
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-7">
            <PosterFrame video={video} variant="hero" />
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal>
              <h1 className="text-display text-balance">{video.title}</h1>
            </Reveal>
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-ink-muted">
                <span className="rounded-full bg-[color-mix(in_srgb,var(--sage)_22%,transparent)] px-2.5 py-0.5 font-medium text-ink">
                  {video.pillar}
                </span>
                <span>{video.topic}</span>
                <span aria-hidden className="h-3 w-px bg-hairline" />
                <span>{video.duration}</span>
              </div>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[58ch]">{video.description}</p>
            </Reveal>
            <Reveal>
              <div className="rounded-[2rem] border border-hairline bg-raised p-7 sm:p-8">
                <p className="text-meta text-gold-text">In production</p>
                <p className="text-display-sm mt-3">This film is being prepared for the Garden.</p>
                <p className="text-body mt-2 text-ink-muted">
                  Join the founding list and be there when it blooms.
                </p>
                <div className="mt-6">
                  <NewsletterForm context="watch" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-title" className="bg-raised">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
          <HorizonDraw className="mb-14" />
          <Reveal>
            <SectionHeading
              title={<span id="related-title">More from the first season</span>}
              lede="Three more films from the season, each tending its own corner of the garden."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-12">
            {related.map((v, i) => (
              <RevealItem
                key={v.slug}
                index={i}
                className={i === 0 ? "md:col-span-2 lg:col-span-6" : "lg:col-span-3"}
              >
                <WatchCard video={v} featured={i === 0} showDescription={i === 0} />
              </RevealItem>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
