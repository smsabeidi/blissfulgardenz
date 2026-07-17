// Watch & Listen: the planned first season, presented honestly as a program
// announcement (design ruling D10). These are proposed production titles for the
// client's approval, tagged "First season · in production". No fake play behavior.
// Journal: three articles drafted from the five-pillars framing and the client's
// public positioning, marked as drafts for the client's voice pass in handoff notes.

export type Video = {
  slug: string;
  title: string;
  pillar: "Physical" | "Social" | "Financial" | "Mental" | "Emotional";
  topic: string;
  duration: string;
  description: string;
  locked?: boolean;
};

export const firstSeason: Video[] = [
  {
    slug: "the-welcome",
    title: "Welcome to the Garden",
    pillar: "Emotional",
    topic: "Beginnings",
    duration: "4 min",
    description:
      "Dr. Laiyemo opens the gate: what Blissful Gardenz is, who it is for, and why harmony is worth tending on purpose.",
  },
  {
    slug: "listening-as-a-second-language",
    title: "Listening as a Second Language",
    pillar: "Emotional",
    topic: "Communication",
    duration: "18 min",
    description:
      "Most of us listen to reply. Learning to listen to understand is a skill, and like any language it can be practiced.",
  },
  {
    slug: "the-finance-conversation",
    title: "The Finance Conversation",
    pillar: "Financial",
    topic: "Money",
    duration: "22 min",
    description:
      "Money is rarely about money. How couples talk about spending, saving, and fairness before resentment does the talking.",
  },
  {
    slug: "two-families-one-table",
    title: "Two Families, One Table",
    pillar: "Social",
    topic: "In-laws & family",
    duration: "16 min",
    description:
      "Marrying a person means joining a family. Setting warm boundaries with parents, siblings, and traditions.",
  },
  {
    slug: "rest-is-a-couples-skill",
    title: "Rest Is a Couple's Skill",
    pillar: "Physical",
    topic: "Health & rest",
    duration: "14 min",
    description:
      "Exhaustion makes strangers of the kindest people. Sleep, health, and energy as shared responsibilities.",
  },
  {
    slug: "the-quiet-season",
    title: "The Quiet Season",
    pillar: "Mental",
    topic: "Hard seasons",
    duration: "20 min",
    description:
      "Every long marriage has a winter. What to hold onto when warmth is hard to find, and how spring is invited back.",
    locked: true,
  },
  {
    slug: "the-repair-conversation",
    title: "The Repair Conversation",
    pillar: "Emotional",
    topic: "Conflict & repair",
    duration: "24 min",
    description:
      "Disagreement is not the danger; disrepair is. A member series on apologizing well and forgiving honestly.",
    locked: true,
  },
  {
    slug: "companion-guide-book-one",
    title: "Companion Conversations: Book One",
    pillar: "Emotional",
    topic: "The trilogy",
    duration: "31 min",
    description:
      "Ray, Kamal, and Adam asked the questions. This member series helps you and your partner answer them for yourselves.",
    locked: true,
  },
];

export type Article = {
  slug: string;
  title: string;
  pillar: string;
  readMinutes: number;
  excerpt: string;
  featured?: boolean;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "the-horizon-habit",
    title: "The Horizon Habit",
    pillar: "Emotional",
    readMinutes: 6,
    featured: true,
    excerpt:
      "Couples who last are not couples who never struggle. They are couples who keep a horizon: something ahead of them, chosen together.",
    body: [
      "Ask a couple in their fortieth year what kept them together and they will rarely mention grand gestures. They mention direction. A shared sense that the marriage was going somewhere, and that both of them had chosen the destination.",
      "That is the horizon habit. It is the practice of lifting your eyes, together, past the laundry and the school run and the unread messages, toward something you are both walking to. A trip. A garden. A grandchild. A quieter year. The object matters less than the act of choosing it together.",
      "In my years of sitting with couples, the ones in real trouble were rarely short on love. They were short on horizon. Each partner privately carried a future, and the futures had quietly stopped matching. Nobody had lied. They had simply stopped comparing notes.",
      "So here is a small practice. Once a season, over an unhurried meal, each of you finishes this sentence: a year from now, I hope we are... Say it plainly. Listen without correcting. You are not negotiating yet; you are comparing horizons.",
      "When the horizons match, name it and enjoy it; that is fuel. When they differ, be glad you found out at dinner and not in a crisis. Differences discovered early are conversations. Differences discovered late are verdicts.",
      "Harmony is not the absence of weather. It is a horizon you keep walking toward, together, in all of it.",
    ],
  },
  {
    slug: "money-is-a-love-language-nobody-teaches",
    title: "Money Is a Love Language Nobody Teaches",
    pillar: "Financial",
    readMinutes: 7,
    excerpt:
      "We teach couples to talk about affection, family, even grief. Then we hand them a joint account and wish them luck.",
    body: [
      "Two people can love each other completely and still mean entirely different things by the word enough. One grew up where money was safety, and saving felt like breathing. The other grew up where money was joy, and spending on the people you love was the whole point of having it.",
      "Neither is wrong. But put them in one household without a conversation, and each will quietly grade the other against a rulebook the other has never seen.",
      "The finance conversation is not about budgets first. It is about biographies. Before you argue numbers, trade stories: what did money mean in the house you grew up in? Who worried about it? What did generosity look like? What did scarcity feel like?",
      "Couples are often astonished by what they hear. The saver learns that the spender is not careless; the spender is loyal to a childhood where giving was love. The spender learns the saver is not joyless; the saver is protecting the family from a fear they inherited.",
      "Only then do numbers become useful. Agree on the shared essentials, agree on a sum each of you may spend without explanation, and agree on when you will talk again. Fairness is not sameness; it is a rule you both helped write.",
      "Money will always be a conversation in your marriage. The only question is whether you have it on purpose, in daylight, or by accident, in resentment.",
    ],
  },
  {
    slug: "the-first-year-is-a-greenhouse",
    title: "The First Year Is a Greenhouse",
    pillar: "Social",
    readMinutes: 5,
    excerpt:
      "Newly married couples are often told the first year is the hardest. It is kinder, and truer, to say the first year is the most formative.",
    body: [
      "A greenhouse is not where a plant lives forever. It is where a plant becomes strong enough to live anywhere. The first year of marriage does the same quiet work, and it deserves the same deliberate care.",
      "In the first year you are writing the habits every later year will inherit. How you disagree. How you apologize. Whose family gets which holiday, and how that decision gets made. Whether hard topics are raised gently and early, or postponed until they raise themselves.",
      "The couples who thrive are rarely the ones with no friction. They are the ones who treated the first year as tender ground: they protected time for each other, they asked for help without shame, and they made their agreements out loud instead of assuming them.",
      "Three greenhouse habits, from years of watching them work. Keep one evening a week that belongs only to the two of you, and defend it cheerfully. Decide together how the two family trees will share you, before a holiday decides for you. And when something stings, say so within three days, kindly, while it is still small.",
      "Tend the first year like a greenhouse and the roots go deep. Everything that blooms later, blooms from there.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
export function getVideo(slug: string) {
  return firstSeason.find((v) => v.slug === slug);
}

// Illustrative member stories (PRD §21.4 requires client-supplied testimonials
// with written permission; until then these are clearly labeled illustrative).
export const illustrativeStories = [
  {
    name: "Adaeze & Chidi",
    stage: "Married 14 years",
    quote:
      "We came in speaking past each other and left with one language between us.",
  },
  {
    name: "Marcus & Renee",
    stage: "Engaged",
    quote: "Every couple gets premarital advice. We got a framework we still use.",
  },
  {
    name: "Folake",
    stage: "Came alone first",
    quote: "I was heard before I was asked to change anything. That mattered.",
  },
  {
    name: "Devon & Amara",
    stage: "Married 6 years",
    quote: "The finance conversation alone was worth the whole season.",
  },
  {
    name: "Grace & Emeka",
    stage: "Married 31 years",
    quote: "Thirty years in, we learned something new about listening.",
  },
] as const;

export const storiesLabel = "Member stories · illustrative until launch";

export const faq = [
  {
    q: "What exactly is the Inner Garden?",
    a: "A membership for couples and individuals: an exclusive video library, downloadable guides and workbooks, a live monthly gathering, and warm rates on private conversations with Dr. Laiyemo.",
  },
  {
    q: "Can my spouse and I share one membership?",
    a: "Yes. Every membership includes the Couple Seat: two logins, two private profiles, one price. The garden is for both of you.",
  },
  {
    q: "What is a harmony conversation?",
    a: "A private, unhurried 60-minute conversation with Dr. Laiyemo, educational and supportive in nature. It is not medical care, psychotherapy, or licensed counseling.",
  },
  {
    q: "I am not ready to bring my spouse. Can I come alone?",
    a: "You can. Many people begin alone, especially in strained seasons. What you share stays between you and Dr. Laiyemo.",
  },
  {
    q: "When does membership open?",
    a: "The Garden opens soon. Founding-list members will be invited first, before the doors open publicly.",
  },
  {
    q: "Can I give a membership as a gift?",
    a: "That is coming with launch: three, six, and twelve month gift memberships designed as wedding gifts. Join the founding list and you will be the first to know.",
  },
  {
    q: "What if it is not for us?",
    a: "Membership will be cancel-anytime, with no dark patterns and no guilt. If the garden is not serving you, you close the gate behind you, friends.",
  },
  {
    q: "Is this a substitute for professional help?",
    a: "No. Harmony conversations are educational and supportive. If you are in crisis, please call or text 988 (US) any hour of any day.",
  },
] as const;
