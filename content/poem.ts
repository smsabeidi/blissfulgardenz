// "Time well spent" — written by Dr. Laiyemo.
//
// His words, his line breaks, his sequence. Nothing here is edited for meter or
// symmetry: the ladder steps second → minute → hour → week → month → year →
// decade → century → lifetime → forever exactly as he wrote it, including the
// rungs he chose to skip. A poem is not copy, and this one is not ours to tidy.
//
// The pairing below is structural, not editorial: each rung is an intention and
// the span of time it is measured against. The hero animation reads that
// structure — the span widens as the visitor descends — so the shape of the
// poem is doing the work, not an effect laid over the top of it.

export type PoemRung = {
  /** The intention: what is wanted. */
  intent: string;
  /** The span it is measured against. */
  span: string;
};

export const poem = {
  title: "Time well spent",
  byline: "Dr. Adeyinka Laiyemo",
  rungs: [
    { intent: "I want to love you", span: "Every second of the minute" },
    { intent: "I want to be in your arms", span: "Every minute of the hour" },
    { intent: "I want to be holding your hands", span: "Every hour of the day" },
    { intent: "I want to be in your presence", span: "Every week of the month" },
    { intent: "I want to be with you", span: "Every month of the year" },
    { intent: "I want to sit with you", span: "Every year of the decade" },
    { intent: "I want to stand with you", span: "Every decade of the century" },
    { intent: "I want to love you", span: "For my entire lifetime" },
    { intent: "I want you in my life", span: "For ever and ever" },
  ] satisfies PoemRung[],
  /** The line that stands alone at the end, and stays. */
  coda: "I love you.",
} as const;
