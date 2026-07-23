import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/content/library";

// Designed poster frames for the first season (design ruling D10: a program
// announcement, never fake play behavior). Redesign pass: posters are now
// photographic stills from the Higgsfield garden library, rendered as a
// deep-green duotone (brand ground + luminosity-blended photo + scrim) so
// every pillar reads as one graded film program. Gradient wash remains as
// the no-photo fallback. Locked films render veiled and always link to
// /membership (design ruling D6).

const pillarPhoto: Record<Video["pillar"], string> = {
  Emotional: "/images/photos/chairs.jpg",
  Social: "/images/photos/couple-path.jpg",
  Financial: "/images/photos/leaf-macro.jpg",
  Physical: "/images/photos/hero-dawn.jpg",
  Mental: "/images/photos/gate-path.jpg",
};

const pillarWash: Record<Video["pillar"], string> = {
  Emotional:
    "linear-gradient(140deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 70%, var(--sage)) 60%, color-mix(in srgb, var(--brand) 55%, var(--gold)) 100%)",
  Financial:
    "linear-gradient(135deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 64%, var(--gold)) 58%, color-mix(in srgb, var(--brand) 50%, var(--gold)) 100%)",
  Social:
    "linear-gradient(150deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 66%, var(--sage)) 52%, color-mix(in srgb, var(--brand) 54%, var(--gold)) 100%)",
  Physical:
    "linear-gradient(160deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 72%, var(--sage)) 55%, color-mix(in srgb, var(--brand) 58%, var(--sage)) 100%)",
  Mental:
    "linear-gradient(145deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 76%, var(--sage)) 50%, color-mix(in srgb, var(--brand) 60%, var(--gold)) 100%)",
};

const lockedWash = "linear-gradient(150deg, #123425 0%, #1F3A2B 55%, #123021 100%)";

function SproutGlyph({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" className={`${className} text-[#e3c25b] opacity-80`}>
      <path
        d="M32 54V30M32 30c0-10 8-16 16-16 0 10-7 16-16 16zM32 38c0-8-6-12-12-12 0 8 5 12 12 12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockBadge() {
  return (
    <span
      aria-hidden
      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a227]/20 text-[#e3c25b]"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3.5" y="7" width="9" height="6" rx="1.5" />
        <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" />
      </svg>
    </span>
  );
}

function DurationBadge({ duration }: { duration: string }) {
  return (
    <span className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-ink-muted">
      {duration}
    </span>
  );
}

export function PosterFrame({
  video,
  variant = "rail",
}: {
  video: Video;
  variant?: "rail" | "featured" | "hero";
}) {
  const locked = Boolean(video.locked);
  const hero = variant === "hero";

  return (
    <div
      aria-hidden={hero || undefined}
      className={`relative flex aspect-video items-end overflow-hidden ${
        hero ? "rounded-[2rem] p-6 sm:p-8" : variant === "featured" ? "rounded-3xl p-6 sm:p-8" : "rounded-3xl p-5"
      }`}
      style={{ background: locked ? lockedWash : pillarWash[video.pillar] }}
    >
      {/* Photographic still, duotone-graded into the brand green */}
      <Image
        src={pillarPhoto[video.pillar]}
        alt=""
        fill
        sizes="(max-width: 640px) 90vw, 480px"
        className={`photo-warm object-cover mix-blend-luminosity ${locked ? "opacity-30" : "opacity-55"}`}
      />
      {/* Depth floor: text over imagery always gets a scrim (DESIGN.md) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(11, 31, 22, 0.62) 0%, rgba(11, 31, 22, 0.08) 55%)",
        }}
      />

      {hero ? (
        <>
          {/* The Horizon Line motif: sun disc resting on a 1px gold line at 62% */}
          <div
            aria-hidden
            className="absolute left-1/2 h-9 w-[4.5rem] -translate-x-1/2 -translate-y-full rounded-t-full bg-[#c9a227]/30"
            style={{ top: "62%" }}
          />
          <div aria-hidden className="absolute inset-x-0 h-px bg-[#c9a227] opacity-45" style={{ top: "62%" }} />
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
            <SproutGlyph className="h-12 w-12" />
          </div>
          <DurationBadge duration={video.duration} />
        </>
      ) : (
        <>
          {locked ? <div aria-hidden className="absolute inset-0 bg-[#0f2e22]/20 backdrop-blur-[2px]" /> : null}
          {locked ? <LockBadge /> : <DurationBadge duration={video.duration} />}
          <div className={`absolute left-5 top-5 ${variant === "featured" ? "sm:left-8 sm:top-7" : ""}`}>
            <SproutGlyph className={variant === "featured" ? "h-10 w-10" : "h-8 w-8"} />
          </div>
          <div className="relative">
            <p
              className={`font-[family-name:var(--font-display)] leading-tight ${
                variant === "featured" ? "text-2xl sm:text-3xl" : "text-xl"
              } ${locked ? "text-brand-ink/90" : "text-brand-ink"}`}
            >
              {video.title}
            </p>
            {locked ? (
              <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-brand-ink-muted/70">
                Inside the Inner Garden
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

// A full poster card: frame + pillar tag + topic. Locked cards open the
// membership pitch, never a dead end (design ruling D6).
export function WatchCard({
  video,
  featured = false,
  showDescription = false,
}: {
  video: Video;
  featured?: boolean;
  showDescription?: boolean;
}) {
  const locked = Boolean(video.locked);

  return (
    <Link
      href={locked ? "/membership" : `/watch/${video.slug}`}
      className="group flex h-full flex-col gap-4"
    >
      <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transition-none">
        <PosterFrame video={video} variant={featured ? "featured" : "rail"} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
          <span className="rounded-full bg-[color-mix(in_srgb,var(--sage)_22%,transparent)] px-2.5 py-0.5 font-medium text-ink">
            {video.pillar}
          </span>
          <span>{video.topic}</span>
        </div>
        {showDescription ? (
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-muted">{video.description}</p>
        ) : null}
        {locked ? (
          <span className="sr-only">A member film. This link opens the Inner Garden membership page.</span>
        ) : null}
      </div>
    </Link>
  );
}
