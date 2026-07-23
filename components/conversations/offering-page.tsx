import { BloomButton } from "@/components/garden/buttons";
import { Reveal, RevealItem, HorizonDraw } from "@/components/garden/reveal";
import { ctaLabels } from "@/content/site";
import type { Offering } from "@/content/offerings";
import { DisclaimerNote } from "./disclaimer-note";
import { ConversationPhotoBand } from "./photo-band";

// Shared offering page, rendered entirely from the Offering object.
// Premarital and Marital open on a slim photographic band: the chairs
// photograph in a deep duotone with the page title over the scrim.
// The quiet flag (the Rebuilding path, design rulings D11/D12) switches to an
// extra-muted, imagery-free art direction: bg-raised canvas, softer display
// type, more whitespace, the confidentiality promise adjacent to the CTA, and
// no stories, testimonials, or photographs anywhere.

function DrawnCheck() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mt-[0.4em] h-4 w-4 shrink-0 text-gold-text">
      <path
        d="M3.5 10.5l4.2 4.5L16.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OfferingPage({ offering }: { offering: Offering }) {
  const quiet = Boolean(offering.quiet);
  const audienceLine = `${offering.label}: for ${offering.audience
    .charAt(0)
    .toLowerCase()}${offering.audience.slice(1)}`;
  const sectionPad = quiet ? "py-28 sm:py-36" : "py-24 sm:py-32";

  return (
    <div className={quiet ? "bg-raised" : undefined}>
      {/* 1 · Opening: photographic band for the two open paths, plain and
          undecorated for the quiet one */}
      {quiet ? (
        <section
          aria-labelledby="offering-title"
          className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:pb-16 sm:pt-40 lg:px-8"
        >
          <div className="flex max-w-3xl flex-col gap-7">
            <Reveal>
              <p className="flex items-center gap-3 text-[15px] font-medium text-gold-text">
                <span aria-hidden className="inline-block h-px w-6 shrink-0 bg-gold" />
                {audienceLine}
              </p>
            </Reveal>
            <Reveal>
              <h1 id="offering-title" className="text-display-xl text-balance">
                {offering.title}
              </h1>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[58ch]">{offering.lede}</p>
            </Reveal>
          </div>
        </section>
      ) : (
        <section aria-labelledby="offering-title">
          <ConversationPhotoBand
            titleId="offering-title"
            title={offering.title}
            kicker={
              <p className="flex items-center gap-3 text-[15px] font-medium text-[#e3c25b]">
                <span aria-hidden className="inline-block h-px w-6 shrink-0 bg-[#c9a227]" />
                {audienceLine}
              </p>
            }
          />
          <div className="mx-auto max-w-7xl px-5 pb-2 pt-10 sm:pt-14 lg:px-8">
            <Reveal>
              <p className="text-lede max-w-[58ch]">{offering.lede}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* 2 · What we talk about + format line */}
      <section aria-labelledby="topics-title" className={`mx-auto max-w-7xl px-5 lg:px-8 ${sectionPad}`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Reveal>
              <HorizonDraw className="max-w-24" />
            </Reveal>
            <Reveal>
              <h2 id="topics-title" className="text-display text-balance">
                What we talk about
              </h2>
            </Reveal>
          </div>
          <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:col-span-8">
            {offering.topics.map((topic, i) => (
              <li key={topic} className="border-t border-hairline">
                <RevealItem index={i}>
                  <div className="flex items-start gap-4 py-6">
                    <DrawnCheck />
                    <span className="text-body">{topic}</span>
                  </div>
                </RevealItem>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className={quiet ? "mt-20" : "mt-16"}>
          <div className="flex items-center gap-6">
            <span aria-hidden className="h-px flex-1 bg-hairline" />
            <p className="max-w-[34rem] text-center text-[15px] text-ink-muted">{offering.format}</p>
            <span aria-hidden className="h-px flex-1 bg-hairline" />
          </div>
        </Reveal>
      </section>

      {/* 3 · What you leave with */}
      <section aria-labelledby="outcomes-title" className={`mx-auto max-w-7xl px-5 lg:px-8 ${sectionPad}`}>
        <div
          className={
            quiet ? undefined : "rounded-[2rem] bg-brand px-7 py-12 text-brand-ink sm:px-12 sm:py-16"
          }
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-4">
              <Reveal>
                <h2 id="outcomes-title" className="text-display text-balance">
                  What you leave with
                </h2>
              </Reveal>
              <Reveal>
                <p className={`text-body max-w-[40ch] ${quiet ? "text-ink-muted" : "!text-brand-ink-muted"}`}>
                  {quiet
                    ? "Small, real, and yours to keep."
                    : "Not homework, not a lecture: three things you can hold."}
                </p>
              </Reveal>
            </div>
            <ul className="flex flex-col lg:col-span-7 lg:col-start-6">
              {offering.outcomes.map((outcome, i) => (
                <li key={outcome} className={`border-t ${quiet ? "border-hairline" : "border-white/15"}`}>
                  <RevealItem index={i}>
                    <div className="flex items-start gap-5 py-7">
                      <span
                        aria-hidden
                        className={`mt-[0.85em] h-px w-6 shrink-0 ${quiet ? "bg-gold" : "bg-[#c9a227]"}`}
                      />
                      <span className={`text-lede ${quiet ? "!text-ink" : "!text-brand-ink-muted"}`}>
                        {outcome}
                      </span>
                    </div>
                  </RevealItem>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4 · Gentle closing + CTA (+ private promise beside the CTA on the quiet path) */}
      <section
        aria-labelledby="closing-title"
        className={`mx-auto max-w-7xl px-5 lg:px-8 ${quiet ? "pb-28 sm:pb-36" : "pb-24 sm:pb-32"}`}
      >
        {quiet ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-6">
              <div className="flex flex-col gap-4 rounded-3xl border border-hairline bg-surface p-8 sm:p-10">
                <h2 id="closing-title" className="text-display-sm text-balance">
                  Between you and Dr. Laiyemo
                </h2>
                <p className="text-body text-ink-muted">
                  Your intake is read only by Dr. Laiyemo. What you share stays between the two of
                  you.
                </p>
              </div>
            </Reveal>
            <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
              <Reveal>
                <p className="text-lede">
                  You may come alone. Nothing you share leaves the conversation.
                </p>
              </Reveal>
              <Reveal>
                <div>
                  <BloomButton href={`/contact?topic=${offering.slug}`}>
                    {ctaLabels.bookConversation}
                  </BloomButton>
                </div>
              </Reveal>
              <Reveal>
                <p className="text-[14px] text-ink-muted">
                  It begins with a short note, whenever you are ready.
                </p>
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="flex max-w-2xl flex-col gap-6">
            <Reveal>
              <h2 id="closing-title" className="text-display text-balance">
                Whenever you are ready
              </h2>
            </Reveal>
            <Reveal>
              <p className="text-lede max-w-[56ch]">
                It begins with a short note. Share only what you are comfortable sharing, and the
                rest unfolds at your pace.
              </p>
            </Reveal>
            <Reveal>
              <div className="mt-2">
                <BloomButton href={`/contact?topic=${offering.slug}`}>
                  {ctaLabels.bookConversation}
                </BloomButton>
              </div>
            </Reveal>
          </div>
        )}

        <Reveal className={quiet ? "mt-24" : "mt-20"}>
          <DisclaimerNote crisis={quiet} className="max-w-3xl" />
        </Reveal>
      </section>
    </div>
  );
}
