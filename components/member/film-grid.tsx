import Link from "next/link";
import Image from "next/image";
import { Check, Play } from "@phosphor-icons/react/dist/ssr";

import type { Video } from "@/content/library";

// The library, presented as an editorial list rather than a grid of tiles.
// A season is read down, not shopped across: one wide row per film, generous
// vertical rhythm, a real still on the left and the writing on the right. It
// also degrades honestly, since a row without a still or without progress is
// still a complete row.

const pillarPhoto: Record<Video["pillar"], string> = {
  Emotional: "/images/photos/chairs.jpg",
  Social: "/images/photos/couple-path.jpg",
  Financial: "/images/photos/leaf-macro.jpg",
  Physical: "/images/photos/hero-dawn.jpg",
  Mental: "/images/photos/gate-path.jpg",
};

/** The still that stands in for a film until its own frame is chosen. */
export function filmPhoto(pillar: Video["pillar"]): string {
  return pillarPhoto[pillar];
}

export type FilmRow = {
  video: Video;
  /** Last position in seconds, from video_progress. Zero when never opened. */
  seconds: number;
  completed: boolean;
  /** False until the film has a Mux asset. */
  available: boolean;
};

export function FilmGrid({ rows }: { rows: FilmRow[] }) {
  return (
    <ol className="flex flex-col">
      {rows.map((row) => (
        <li key={row.video.slug} className="border-b border-hairline last:border-b-0">
          <FilmRowLink row={row} />
        </li>
      ))}
    </ol>
  );
}

function FilmRowLink({ row }: { row: FilmRow }) {
  const { video } = row;
  const percent = watchedPercent(row);

  return (
    <Link
      href={`/garden/library/${video.slug}`}
      className="group grid grid-cols-1 gap-6 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10"
    >
      <div className="sm:col-span-5 lg:col-span-4">
        <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-brand-deep ring-1 ring-hairline">
          <Image
            src={filmPhoto(video.pillar)}
            alt=""
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 40vw, 100vw"
            className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
          />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,13,0.10)_0%,rgba(8,18,13,0.55)_100%)]" />
          {row.available ? (
            <span
              aria-hidden
              className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(8,18,13,0.55)] text-[#e3c25b] ring-1 ring-[rgba(233,228,214,0.24)]"
            >
              <Play weight="light" className="h-4 w-4" />
            </span>
          ) : null}
          {percent === null ? null : (
            // A resume line, not a progress meter: it says where you stopped
            // and nothing about how much is left to achieve.
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[3px] bg-[rgba(233,228,214,0.22)]"
            >
              <span
                className="block h-full bg-gold"
                style={{ width: `${percent}%` }}
              />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:col-span-7 lg:col-span-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-ink-muted">
          <span className="rounded-full bg-[color-mix(in_srgb,var(--sage)_22%,transparent)] px-2.5 py-0.5 font-medium text-ink">
            {video.pillar}
          </span>
          <span>{video.topic}</span>
          <span aria-hidden className="h-3 w-px bg-hairline" />
          <span>{video.duration}</span>
        </div>

        <h3 className="text-display-sm text-balance transition-colors duration-300 group-hover:text-gold-text motion-reduce:transition-none">
          {video.title}
        </h3>

        <p className="text-body line-clamp-2 max-w-[58ch] text-ink-muted">
          {video.description}
        </p>

        <FilmStatus row={row} />
      </div>
    </Link>
  );
}

function FilmStatus({ row }: { row: FilmRow }) {
  if (!row.available) {
    return <p className="text-meta text-ink-muted">Arriving soon</p>;
  }
  if (row.completed) {
    return (
      <p className="text-meta flex items-center gap-2 text-gold-text">
        <Check weight="light" className="h-4 w-4" aria-hidden />
        Watched
      </p>
    );
  }
  if (row.seconds > 0) {
    return <p className="text-meta text-gold-text">Continue watching</p>;
  }
  return null;
}

/**
 * Rough percentage watched, or null when there is nothing to show.
 *
 * Duration is editorial copy ("18 min"), so this is an approximation and is
 * never treated as truth. The player itself resumes from the exact second.
 */
function watchedPercent(row: FilmRow): number | null {
  if (!row.available || row.completed || row.seconds <= 0) return null;

  const total = durationSeconds(row.video.duration);
  if (total === null || total <= 0) return null;

  const percent = Math.round((row.seconds / total) * 100);
  if (percent < 2 || percent > 98) return null;
  return percent;
}

function durationSeconds(label: string): number | null {
  const match = /(\d+)\s*min/i.exec(label);
  return match ? Number(match[1]) * 60 : null;
}
