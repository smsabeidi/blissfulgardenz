import Link from "next/link";
import { BloomButton } from "@/components/garden/buttons";
import { PetalCard } from "@/components/garden/primitives";
import { amountDue, formatUsd, type ConversationPricing } from "@/lib/pricing";

// The booking affordance for a private conversation with Dr. Laiyemo.
//
// Booking is a link out to Cal.com on purpose. A slot picker of our own would
// mean owning timezones, DST, buffers and double-booking races, and the
// failure mode of getting any of those wrong is telling someone in a hard
// season that their conversation is cancelled. Cal.com already solves it.
//
// This component also owns the not-yet-configured state. One component owning
// both states is the only way they cannot drift apart, and the state a person
// sees when scheduling is not live is the one most likely to be forgotten.
//
// Server component: nothing here is interactive beyond a link.
// Heading level: renders h3, so the calling section should own an h2.

type BookingPanelProps = {
  pricing: ConversationPricing;
  /** env.calBookingUrl(). Null when scheduling is not live yet. */
  bookingUrl: string | null;
};

const steps = [
  {
    title: "Choose a time",
    body: "The scheduling page shows open hours in your own time zone. Pick the one that suits you.",
  },
  {
    title: "A confirmation arrives",
    body: "You will receive an email with the details and the link to join. Everything you need is in it.",
  },
  {
    title: "We talk",
    body: "Fifty minutes with Dr. Laiyemo, by video or audio, held in confidence.",
  },
] as const;

function PriceBlock({ pricing }: { pricing: ConversationPricing }) {
  const due = amountDue(pricing);

  return (
    <div>
      <p className="text-meta text-ink-muted">
        {pricing.isMemberRate ? "Your member rate" : "Your rate"}
      </p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-display-sm">{formatUsd(due)}</span>
        <span className="text-body text-ink-muted">for fifty minutes</span>
      </p>

      {pricing.savingsNote ? (
        <p className="mt-3 text-[15px] leading-relaxed text-gold-text">{pricing.savingsNote}</p>
      ) : null}

      {/* Stated once, plainly: a member who is not a member yet should know the
          rate exists, and should not have to find it somewhere else. No
          urgency, no countdown, no comparison table. */}
      {!pricing.isMemberRate && pricing.memberRate !== null ? (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
          Bloom members pay {formatUsd(pricing.memberRate)} for the same hour.{" "}
          <Link
            href="/membership"
            className="text-gold-text underline decoration-hairline underline-offset-4 transition-colors hover:decoration-current"
          >
            About membership
          </Link>
        </p>
      ) : null}

      {/* The rate above is display only. Cal.com and Stripe hold the real
          number, so we promise nothing this page cannot guarantee. */}
      <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
        The scheduling page confirms the amount before anything is charged.
      </p>
    </div>
  );
}

export function BookingPanel({ pricing, bookingUrl }: BookingPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <PetalCard>
        <div className="flex flex-col gap-8">
          <PriceBlock pricing={pricing} />

          <div className="h-px w-full bg-hairline" aria-hidden />

          {bookingUrl ? (
            <div>
              <BloomButton href={bookingUrl} external>
                Choose a time
                <span className="sr-only"> (opens a scheduling page in a new tab)</span>
              </BloomButton>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-muted">
                This opens our scheduling page in a new tab. Your place here stays open behind it.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-display-sm">Scheduling opens shortly</p>
              <p className="mt-3 max-w-[52ch] text-body text-ink-muted">
                The scheduling page is not live yet. Write to us and we will arrange a time with you
                by email in the meantime.
              </p>
              <div className="mt-5">
                <BloomButton href="/contact">Write to us</BloomButton>
              </div>
            </div>
          )}

          <div className="h-px w-full bg-hairline" aria-hidden />

          <div>
            <h3 className="text-display-sm">What happens next</h3>
            <ol className="mt-5 flex flex-col gap-5">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="text-meta mt-1 w-5 shrink-0 tabular-nums text-gold-text"
                  >
                    {`0${i + 1}`}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[16px] font-medium leading-snug text-ink">
                      {step.title}
                    </span>
                    <span className="max-w-[52ch] text-[15px] leading-relaxed text-ink-muted">
                      {step.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="max-w-[58ch] text-[15px] leading-relaxed text-ink-muted">
            Plans change. You can move or cancel your time from the link in that email, up to twenty
            four hours before. Closer than that, write to us and we will do our best to find you
            another hour.
          </p>
        </div>
      </PetalCard>

      {/* Deliberately outside the card: this is reassurance, not a step. */}
      <aside
        aria-label="About the questions asked before a conversation"
        className="rounded-2xl border border-hairline px-7 py-6"
      >
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
          Before a first conversation we send a few short questions. They take a few minutes, and
          they let the hour begin where you actually are rather than at the very beginning.{" "}
          <span className="text-ink">Only Dr. Laiyemo reads your answers.</span> Share what you want
          to share and leave the rest.
        </p>
      </aside>
    </div>
  );
}
