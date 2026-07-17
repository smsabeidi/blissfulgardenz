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
    audience: "Engaged and newly married couples building their foundation",
    lede: "Before the vows, the conversations. A shared framework for the life you are planting together.",
    topics: [
      "Expectations each of you is quietly carrying",
      "Money, family, and faith before they become surprises",
      "How you will disagree, and how you will repair",
      "The first year, planned with open eyes",
    ],
    format: "Private 60-minute conversations, scheduled around you",
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
    format: "Private 60-minute conversations, together or beginning alone",
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
    audience: "Anyone in a strained season, arriving together or alone",
    lede: "Some seasons are hard to say out loud. You may come alone, and you may come exactly as you are.",
    topics: [
      "Finding words for what has been silent",
      "Whether and how to invite your spouse in",
      "Steady first steps back toward harmony",
      "Hope that is honest about the work ahead",
    ],
    format: "Private 60-minute conversations. Confidential, unhurried, one person or two",
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
    body: "Sixty minutes, unhurried and confidential, by video or in person.",
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
};

export const tiers: Tier[] = [
  {
    slug: "bloom",
    name: "Bloom",
    price: { monthly: "$39", annual: "$390", annualNote: "two months free" },
    featured: true,
    lede: "The full garden: the library, the vault, the gatherings, and a seat for your partner.",
    includes: [
      "Full exclusive video library and series",
      "Resource Vault: guides, workbooks, and the companion guides to all three books",
      "Monthly live Garden Gathering, with replays",
      "The Couple Seat: a second login for your spouse or partner",
      "Member rate on private conversations (15% off)",
    ],
    conversationBenefit: "Member rate: $255 per 60-minute conversation",
  },
  {
    slug: "evergreen",
    name: "Evergreen",
    price: { monthly: "$249", annual: "$2,490", annualNote: "two months free" },
    lede: "Everything in Bloom, plus a standing conversation with Dr. Laiyemo every month.",
    includes: [
      "Everything in Bloom",
      "One private 60-minute conversation included each month",
      "Priority scheduling",
      "A direct message line to the Blissful Gardenz team",
      "An annual relationship check-up plan",
    ],
    conversationBenefit: "One conversation each month, included",
  },
];

export const visitorTier = {
  name: "Visitor",
  price: "Free",
  includes: [
    "Seeds of Harmony, the monthly letter",
    "The free library, with saved favorites",
    "Three starter videos from the member library",
  ],
} as const;

export const coupleSeat = {
  title: "One membership. Two seats.",
  body: "Blissful Gardenz is for couples, so a membership never asks two people to pay twice. Invite your partner by email: each of you keeps a private profile, your own progress, and your own notes, under one shared membership.",
} as const;

export const consultationPricing = {
  standard: "$300 per 60-minute conversation",
  memberNote: "Bloom members save 15%. Evergreen includes one conversation monthly.",
} as const;
