import { consultationPricing } from "@/content/offerings";
import type { Access } from "@/lib/db/types";

// What a person pays for a private conversation, in one place.
//
// DISPLAY ONLY. This module cannot move money and must never be able to. The
// authoritative charge is created by Stripe through the Cal.com booking flow,
// reading Stripe's own price objects. The separation is deliberate: if the
// copy in content/offerings drifts from the real price, the worst outcome here
// is that someone sees a stale number and writes to us, which is a
// conversation we can have. If this file could set the charge, the same drift
// would take the wrong amount from someone's card, which is a breach of trust
// we could not undo. So: read from here to render, never to bill.
//
// Everything below is pure. Same input, same output, no I/O, no clock.

/** Used when the price string in content/offerings cannot be parsed. */
const STANDARD_FALLBACK_USD = 300;

/** Used when the member discount cannot be parsed. Matches the Bloom tier copy. */
const MEMBER_DISCOUNT_FALLBACK = 0.15;

// The prose in content/offerings is the copy the client approves, so it is the
// source of truth for the number too. Parsing it keeps one price in the repo
// instead of two that can disagree. A parse failure falls back rather than
// throwing: a booking page that renders a slightly stale rate is recoverable,
// a booking page that crashes is not.
function parseStandardUsd(source: string): number {
  const match = /\$\s*([\d,]+(?:\.\d+)?)/.exec(source);
  if (!match || !match[1]) return STANDARD_FALLBACK_USD;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? value : STANDARD_FALLBACK_USD;
}

function parseMemberDiscount(source: string): number {
  const match = /(\d{1,2}(?:\.\d+)?)\s*%/.exec(source);
  if (!match || !match[1]) return MEMBER_DISCOUNT_FALLBACK;
  const percent = Number(match[1]);
  // A percentage outside this range is a typo in the copy, not an instruction
  // to give the conversation away or to charge more than the standard rate.
  if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) {
    return MEMBER_DISCOUNT_FALLBACK;
  }
  return percent / 100;
}

const STANDARD_USD = parseStandardUsd(consultationPricing.standard);
const MEMBER_DISCOUNT = parseMemberDiscount(consultationPricing.memberNote);

// Whole dollars, because that is how both the copy and Stripe express these
// prices. Rounding here can only shift a display figure by cents, and never
// the amount charged.
const MEMBER_RATE_USD = Math.round(STANDARD_USD * (1 - MEMBER_DISCOUNT));

export type ConversationPricing = {
  /** The published rate for one sixty minute conversation, in whole US dollars. */
  standard: number;
  /** What a Bloom member pays, or null when no valid discount is configured. */
  memberRate: number | null;
  /** True when this viewer is entitled to the member rate right now. */
  isMemberRate: boolean;
  /** One plain sentence naming the saving, only when the viewer receives it. */
  savingsNote: string | null;
};

/**
 * Resolve what to show this viewer. Pass the Access returned by getAccess().
 */
export function conversationPricing(access: Access): ConversationPricing {
  // A "discount" that is not actually cheaper is not a member rate. Treating
  // it as absent keeps the panel from announcing a saving of zero.
  const memberRate = MEMBER_RATE_USD < STANDARD_USD ? MEMBER_RATE_USD : null;
  const isMemberRate = access.isMember && memberRate !== null;

  const savingsNote =
    isMemberRate && memberRate !== null
      ? `Your membership takes ${formatUsd(STANDARD_USD - memberRate)} off the standard rate of ${formatUsd(STANDARD_USD)}.`
      : null;

  return { standard: STANDARD_USD, memberRate, isMemberRate, savingsNote };
}

/**
 * The single figure to put in front of the viewer. Kept beside the resolver so
 * a surface cannot accidentally show a member rate to someone who does not
 * have one, or the standard rate to someone who does.
 */
export function amountDue(pricing: ConversationPricing): number {
  return pricing.isMemberRate && pricing.memberRate !== null
    ? pricing.memberRate
    : pricing.standard;
}

/**
 * Fixed en-US formatting so server and client render byte-identical output.
 * Whole dollars lose the trailing zeros, anything else keeps cents.
 */
export function formatUsd(amount: number): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
