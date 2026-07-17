import type { Book } from "@/content/books";

// Audio sample player, in its designed disabled state (design ruling: no audio
// asset yet). A static gold waveform, a play glyph, and an honest caption.
// No fake play behavior: the control is a disabled button with aria-disabled
// and a title explaining why. Server component; nothing here is interactive.

// Deterministic waveform silhouette (same on every render; no randomness).
const BARS = Array.from({ length: 44 }, (_, i) => {
  const wave = Math.sin(i * 0.7) * Math.sin(i * 0.23 + 1.4);
  return 10 + Math.round(Math.abs(wave) * 24);
});

export function SamplePlayer({ book }: { book: Book }) {
  const { duration, narrator } = book.formats.audiobook;
  return (
    <div className="flex h-full flex-col justify-center gap-5 rounded-[2rem] border border-hairline bg-surface p-8">
      <p className="text-meta text-ink-muted">Audiobook sample</p>
      <div className="flex items-center gap-5">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="The audiobook sample is on its way. Nothing plays here yet."
          className="flex h-12 w-12 shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-hairline text-gold-text opacity-60"
        >
          <span className="sr-only">Play audiobook sample (arriving soon)</span>
          <svg aria-hidden viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" fill="currentColor">
            <path d="M4.5 2.8v10.4c0 .5.55.8.97.53l8.1-5.2a.63.63 0 0 0 0-1.06l-8.1-5.2a.63.63 0 0 0-.97.53z" />
          </svg>
        </button>
        <svg
          aria-hidden
          viewBox="0 0 264 48"
          preserveAspectRatio="none"
          className="h-12 w-full text-gold opacity-45"
        >
          {BARS.map((h, i) => (
            <rect
              key={i}
              x={i * 6}
              y={(48 - h) / 2}
              width="3"
              height={h}
              rx="1.5"
              fill="currentColor"
            />
          ))}
        </svg>
      </div>
      <p className="text-[15px] leading-relaxed text-ink-muted">
        Audiobook sample arriving soon. {duration} listen, narrated by {narrator}.
      </p>
    </div>
  );
}
