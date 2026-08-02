// Harmony Conversations offerings (PRD §7.3), membership tiers (PRD §8.1),
// and the five pillars (PRD §3). Pricing is the PRD's proposed structure,
// pending client validation at Milestone 1.

export const pillars = [
  {
    numeral: "I",
    name: "Physical",
    line: "Rest, health, and the energy to show up for each other.",
  },
  {
    numeral: "II",
    name: "Social",
    line: "Friendships, family ties, and a community that holds you both.",
  },
  {
    numeral: "III",
    name: "Financial",
    line: "Money conversations held early, honestly, and without blame.",
  },
  {
    numeral: "IV",
    name: "Mental",
    line: "Clarity, patience, and room for two different inner worlds.",
  },
  {
    numeral: "V",
    name: "Emotional",
    line: "Feeling safe enough to be fully known, and fully welcome.",
  },
] as const;

export type Offering = {
  slug: string;
  label: string;
  title: string;
  audience: string;
  lede: string;
  topics: string[];
  format: string;
  outcomes: string[];
  quiet?: boolean;
};

export const offerings: Offering[] = [
  {
    slug: "premarital",
    label: "Premarital",
    title: "Begin as you mean to grow",
    audience:
      "Anyone preparing for marriage, whether single and thinking ahead, dating with intention, engaged, or newly wed",
    lede: "Before the vows, the conversations. A shared framework for the life you are planting together.",
    topics: [
      "Expectations each of you is quietly carrying",
      "Money, family, and faith before they become surprises",
      "How you will disagree, and how you will repair",
      "The first year, planned with open eyes",
    ],
    format: "Private 50-minute sessions, scheduled around you",
    outcomes: [
      "A shared language for the hard topics",
      "Agreements made before the pressure arrives",
      "Confidence that you have seen each other clearly",
    ],
  },
  {
    slug: "marital",
    label: "Marital",
    title: "Tend what you have planted",
    audience: "Couples in the thick of marriage, five years in or thirty",
    lede: "A garden grows best when it is tended on purpose. So does a marriage.",
    topics: [
      "Communication that has gone quiet or gone sharp",
      "Parenting as partners, not opponents",
      "Finances, in-laws, and the weight of routine",
      "Finding each other again inside busy lives",
    ],
    format: "Private 50-minute sessions, together or beginning alone",
    outcomes: [
      "Old patterns named without shame",
      "Practical steps you both agreed to",
      "Warmth that returns on purpose, not by luck",
    ],
  },
  {
    slug: "postmarital",
    label: "Rebuilding",
    title: "Begin privately. Begin gently.",
    audience:
      "Anyone in a hard or changed season, whether separated, divorced, widowed, or simply unsure, arriving together or alone",
    lede: "Some seasons are hard to say out loud. You may come alone, and you may come exactly as you are.",
    topics: [
      "Finding words for what has been silent",
      "Whether and how to invite your spouse in",
      "Steady first steps back toward harmony",
      "Hope that is honest about the work ahead",
    ],
    format: "Private 50-minute sessions. Confidential, unhurried, one person or two",
    outcomes: [
      "A private space where nothing is judged",
      "A path back that you chose yourself",
      "Support that stays between you and Dr. Laiyemo",
    ],
    quiet: true,
  },
];

export const conversationSteps = [
  {
    title: "Reach out",
    body: "A short note through the contact page. Share only what you are comfortable sharing.",
  },
  {
    title: "Private intake",
    body: "A gentle set of questions, read only by Dr. Laiyemo, so the first conversation starts in the right place.",
  },
  {
    title: "The conversation",
    body: "Fifty minutes per session, unhurried and confidential, by video or audio, focused on you.",
  },
  {
    title: "Follow-up and resources",
    body: "Notes on what you agreed, and readings from the library chosen for you.",
  },
] as const;

export type Tier = {
  slug: string;
  name: string;
  price: { monthly: string; annual: string; annualNote: string };
  featured?: boolean;
  lede: string;
  includes: string[];
  conversationBenefit: string;
  /**
   * Where this tier's button goes when it cannot be bought yet.
   *
   * Family is priced and described, but `seat_role` is an enum of exactly
   * ('owner','partner'), so the platform can provision two seats and not four.
   * Selling it today would take money for something we cannot deliver, so the
   * card asks instead of charging until the seat model supports a household.
   */
  cta?: { label: string; href: string };
};

// The conversation rate, written once and composed into every sentence below
// that names it.
//
// There is ONE published session price: $150. The member's additional 10% is a
// benefit applied when they book, not a second price on the page. Publishing
// $135 beside $150 meant the site quoted two different numbers for the same
// hour and invited the question of which one is real.
//
// MEMBER_RATE deliberately equals STANDARD_RATE: lib/pricing.ts treats a member
// figure that is not below standard as "no separate rate" and shows the single
// price, so nothing downstream needs to know this changed.
const STANDARD_RATE = "$150";
const MEMBER_RATE = "$150";
const FOUR_SESSION_RATE = "$500"; // four sessions, a $100 saving
const SESSION_LENGTH = "50-minute";

export const tiers: Tier[] = [
  {
    slug: "bloom",
    name: "Individual",
    price: { monthly: "$5", annual: "$50", annualNote: "save 20%" },
    featured: true,
    lede: "The full garden: the library, the vault, the gatherings, and warmer rates on private conversations.",
    includes: [
      "Exclusive videos on sensitive topics, not available on YouTube",
      "First to know when new videos by Dr. Laiyemo are published",
      "Resource Vault: guides, workbooks, and the companion guides to all three books",
      "Free attendance at the monthly webinar hosted by Dr. Laiyemo",
      "Seeds of Harmony, the monthly newsletter",
      "An additional 10% off private harmony conversations",
      "An additional 10% off annual convention participation",
    ],
    conversationBenefit: "An additional 10% off private harmony conversations",
  },
  {
    slug: "family",
    name: "Family",
    price: { monthly: "$10", annual: "$100", annualNote: "save 20%" },
    lede: "Everything in the Individual membership, for up to four people under one price.",
    includes: [
      "Everything in the Individual membership",
      "Up to four family members, each with their own email address and login",
      "A private profile, progress, and notes for every member",
      "One price, however many of you are tending it",
    ],
    conversationBenefit: "An additional 10% off private harmony conversations",
    cta: { label: "Ask about family membership", href: "/contact?topic=family" },
  },
];

// What a member gets ON THE DAY THEY PAY, said plainly.
//
// The film library and the Resource Vault are authored but not yet filmed or
// written, so the tier list below describes a membership that is still filling
// out. Selling that list without saying so would be selling an empty shelf.
// This note sits beside every join button and under the tier grid, so nobody
// pays expecting a library tonight.
export const openingNote =
  "The Garden is opening. Your member rate on private conversations, the monthly webinar with Dr. Laiyemo, and Seeds of Harmony begin the day you join. Films and guides are published as they are finished, and your membership covers every one of them as it arrives.";

export const membershipNote =
  "Blissful Gardenz is for individuals, couples, and families with unique email addresses. The Inner Garden is for adults, eighteen and over.";

export const consultationPricing = {
  standard: `${STANDARD_RATE} per ${SESSION_LENGTH} session`,
  // Parsed by lib/pricing.ts as the authoritative member figure for display.
  member: `${MEMBER_RATE} per ${SESSION_LENGTH} session`,
  packageNote: `${FOUR_SESSION_RATE} when you book four sessions, a saving of $100.`,
  memberNote: "Members receive an additional 10% off, applied when you book.",
} as const;
