import { poem } from "@/content/poem";

// "Time well spent", set into the hero flight.
//
// THE IDEA: the poem is a ladder of widening time, so the type widens with it.
// Each rung's span line is scaled by --rung-scale, stepping from 1 at "every
// second of the minute" to its full size at "for ever and ever". Nothing else
// moves size. By the last rung the visitor has watched a sentence about a
// second grow into a sentence about a lifetime, which is the poem's own
// argument made visible rather than decorated.
//
// TWO PRESENTATIONS, ONE DOM. In `animated` mode the rungs are stacked in the
// same grid cell and the parent's ScrollTrigger cross-fades them, so scroll
// position is the playhead and the visitor sets their own reading pace. In
// static mode (touch, reduced motion, no film) the identical markup lays out as
// an ordinary column and simply reads, top to bottom.
//
// Either way every line is in the document from first paint. Nothing is
// injected on scroll, so a screen reader, a search crawler, and a visitor with
// JavaScript disabled all receive the whole poem in the poet's order. The
// stacking is presentational only.

// THE SHADOW FOLLOWS THE GROUND, because the two presentations do not have the
// same one.
//
// The animated flight now has a scrim behind it (data-poem-scrim), so the type
// sits on a settled surface and only needs its edges tidied against the grain.
// A 40px halo there is actively harmful: at that radius it greys the air around
// every letter, which is precisely what stops a serif looking crisp.
//
// The static stanza — touch, reduced motion, no film — has NO scrim. It reads
// straight over the looping garden, so it keeps the wide halo it has always
// had. That is the presentation the client singled out as working, and it would
// have quietly lost contrast if these constants were shared.
const SHADOW_ON_SCRIM = "[text-shadow:0_1px_12px_rgba(8,20,14,0.5)]";
const SHADOW_ON_FILM = "[text-shadow:0_2px_40px_rgba(11,31,22,0.55)]";

export function HeroPoem({ animated }: { animated: boolean }) {
  const shadow = animated ? SHADOW_ON_SCRIM : SHADOW_ON_FILM;
  const IVORY = `text-[#f5f3ea] ${shadow}`;
  const GOLD = `text-[#e4ce7f] ${shadow}`;

  return (
    <figure
      data-hero-poem
      className={
        animated
          ? // Stacked: one grid cell, every rung laid over every other.
            // pointer-events-none so the poem never intercepts a click meant
            // for the film or the CTA beneath.
            //
            // Deliberately NOT hidden by a CSS class here. The timeline sets
            // the opening state itself, and this layout is only requested once
            // that timeline exists, so a stalled or failed ticker leaves the
            // poem readable as a plain stanza instead of stranding it at zero.
            "pointer-events-none absolute inset-x-0 top-1/2 z-10 mx-auto grid w-full max-w-[46rem] -translate-y-1/2 grid-cols-1 grid-rows-1 place-items-center px-5"
          : "mx-auto flex w-full max-w-[34rem] flex-col items-center gap-5 px-5"
      }
    >
      <figcaption className="sr-only">
        {poem.title}, by {poem.byline}
      </figcaption>

      {/* The title, shown once as the poem begins (animated) or as a heading
          above the stanza (static). */}
      {/* OFFSET BY MARGIN, NOT BY TRANSFORM — and that is not a style choice.
          This used to lift itself with -translate-y-[7.5rem]. GSAP animates the
          title's `y`, and `y` is written as a transform, so the moment the
          timeline touched it the class was overwritten and the title dropped
          from above the verse onto the middle of it. In a place-items-center
          grid cell a bottom margin does the same job and nothing else in the
          system writes to it. */}
      <p
        data-poem-title
        className={`text-meta ${GOLD} ${
          animated ? "col-start-1 row-start-1 mb-[15rem]" : "opacity-90"
        }`}
      >
        {poem.title}
      </p>

      {poem.rungs.map((rung, i) => (
        <p
          key={`${rung.intent}-${rung.span}`}
          data-poem-rung={i}
          style={{
            // Steps 1 → 1.28 across the ladder. Applied to the span line only.
            "--rung-scale": (1 + (i / (poem.rungs.length - 1)) * 0.28).toFixed(3),
          } as React.CSSProperties}
          className={
            animated
              ? "col-start-1 row-start-1 flex flex-col items-center gap-2 text-center"
              : "flex flex-col items-center gap-1.5 text-center"
          }
        >
          <span
            className={`font-[family-name:var(--font-display)] text-[clamp(1.5rem,1rem+2.1vw,2.75rem)] font-[500] leading-[1.14] tracking-[-0.01em] ${IVORY}`}
          >
            {rung.intent}
          </span>
          <span
            className={`font-[family-name:var(--font-display)] italic leading-[1.2] ${GOLD}`}
            style={{
              fontSize: animated
                ? "calc(clamp(1.0625rem, 0.85rem + 0.95vw, 1.5rem) * var(--rung-scale))"
                : undefined,
            }}
          >
            {rung.span}
          </span>
        </p>
      ))}

      {/* The coda stands alone and, once it arrives, stays. */}
      <p
        data-poem-coda
        className={
          animated
            ? `col-start-1 row-start-1 font-[family-name:var(--font-display)] text-[clamp(2rem,1.2rem+3.2vw,4rem)] font-[500] italic leading-[1.1] ${IVORY}`
            : `font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] font-[500] italic leading-[1.1] ${IVORY}`
        }
      >
        {poem.coda}
      </p>

      {/* The poet, under his own last line. Visible now rather than only in the
          figcaption: a poem carries its author, and a visitor who has just read
          nine rungs of it should be told whose words those were without having
          to use a screen reader to find out. In the animated flight it sits
          below the coda and arrives just after it; in the static stanza it is
          simply the last line. */}
      <p
        data-poem-byline
        // aria-hidden because the figcaption above already gives a screen
        // reader the title and the poet. This is the same fact, made visible.
        aria-hidden={animated ? true : undefined}
        className={`text-meta ${GOLD} ${
          // Margin, not transform — same reason as the title. GSAP owns `y` here.
          animated ? "col-start-1 row-start-1 mt-[11rem] opacity-0" : "opacity-75"
        }`}
      >
        {poem.byline}
      </p>
    </figure>
  );
}
