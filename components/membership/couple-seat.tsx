import { coupleSeat } from "@/content/offerings";
import { Reveal } from "@/components/garden/reveal";

// Couple Seat band (design ruling D25): the emotional frame that sits ABOVE
// the tier pricing. Two thin linked rings, gold and sage, one overlap.

function LinkedRings() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 128 88"
      className="h-24 w-auto sm:h-28"
      fill="none"
    >
      <circle cx="49" cy="44" r="30" stroke="var(--gold)" strokeWidth="1.5" opacity="0.9" />
      <circle cx="79" cy="44" r="30" stroke="var(--sage)" strokeWidth="1.5" />
    </svg>
  );
}

export function CoupleSeatBand() {
  return (
    <section aria-labelledby="couple-seat-title" className="bg-raised">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:py-28 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <LinkedRings />
          </Reveal>
          <div className="flex flex-col gap-5 lg:col-span-8 lg:col-start-5">
            <Reveal>
              <h2 id="couple-seat-title" className="text-display text-balance">
                {coupleSeat.title}
              </h2>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[60ch]">{coupleSeat.body}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
