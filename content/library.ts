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
    slug: "the-ever-expanding-horizon",
    title: "The Ever-expanding Horizon",
    pillar: "Emotional",
    readMinutes: 3,
    featured: true,
    excerpt:
      "Ask those who tied their nuptial knots over forty years ago, and selfish no longer exists as a word in their combined marital dictionary.",
    body: [
      "The newborn boy only cares about himself while nobody else matters in the new world the newborn girl suddenly finds herself in. Any desire or want is demanded with cries that are hard to ignore. Attention is craved the same way as food, water and oxygen. Ask married couples who have survived the first two years of marriage, and they will tell you they have had to look beyond themselves at least once. Ask those who have been married for twenty years, and they have stopped counting how many ways and how many times their preferences have taken the back seats even when they were in the drivers’ seats. Don’t bother asking those who tied their nuptial knots over forty years ago, selfish no longer exist as a word in their combined marital dictionary otherwise they would not have made it that far.",
      "Indeed, looking beyond one’s nose and looking farther than any binoculars or telescope could enable one to achieve is what two hearts beating together as one achieve when marital bliss is the goal and togetherness is the vehicle for achieving their collective objective. Yes, those hearts reside in different chests, but their togetherness crosses physical bounds since their hearts can feel what their skin cannot.",
      "So, keep your eyes wide open, enjoy the vast ever-expanding horizon that every day of a blissful marriage brings and let your hearts never stop saying…  “from the top and bottom of my heart, from the four chambers of my heart, from the left and the right side of my heart, and from my atria and my ventricles, I love you.”",
    ],
  },
  {
    slug: "money-is-the-route-to-undefined-destination",
    title: "Money is the Route to Undefined Destination",
    pillar: "Financial",
    readMinutes: 3,
    excerpt:
      "Money is the only thing that stinks and we still want it. Yet money is not an end, but a tool to satisfy our needs and wants.",
    body: [
      "It is often said that “money is the root of all evil” and “money is the route to all evil”. Yet, money is the only thing that stinks and we still want it. Money is putrid and we still hanker after it. I have never seen anybody who is allergic to money. Have you? However, money is not an end but a tool to achieve some objectives to satisfy our needs and wants. For most people, their philosophy of money changes with whether they have plenty of it or not. Unfortunately, some people are covetous of it and end up being slaves of it such that they remain poor despite having lots of it sitting in vaults in banks, big and small, near and far, known and hidden in secret codes that often die with the hoarder.",
      "“Who wants to marry a poor man?” is a show that ladies don’t sign up for as contestants. Who wants to give a rose of love to a broke guy? Therefore, every man thinks that being handsome and rich fires the cupid arrow straight into the ventricles of pretty ladies regardless of their religiosity.",
      "Yes, poverty can put love to test, but money cannot buy enduring happiness. Why do billionaires go to divorce courts? So, we come to the unnerving conclusion that money is good when used well, but happiness is the ultimate desire of every couple, and it is not for sale in any currency. So, I ask you my beloved, “how do you make money work for your happiness without negatively affecting your well-being?”",
    ],
  },
  {
    slug: "stumbling-out-of-the-gate",
    title: "Stumbling Out of the Gate",
    pillar: "Social",
    readMinutes: 3,
    excerpt:
      "The uneven surface causing the trip and fall is often there before the “I do”, but was missed.",
    body: [
      "The push of the button, the opening of the gates, the tug of the jockeys, the quick strides of hoofs, the cloud of exciting dust, and the anticipation of the finish line all leads to the claim of the roses. The triumphant horse gallops to the winner’s circle, the small-sized jockey on it becomes an immortal giant in the record books. Success is sweeter than honey indeed.",
      "But what happens when the newlywed couple stumble out of their wedding gate? What should happen if the marital horse slows down at the one-mile mark? If his horse is limping when only two horses’  length to the finish line, can the jockey carry his horse? These are unsettling questions we never want to face.",
      "The reality that working on marriage is a task rather than a sweet fantasy often starts within the first few months of exchanging wedding rings. The marriage contract and wedding vows lose their wow when unanticipated challenges creep up like weeds in a perfect lawn. However, the conversion from daydream to nightmare is not a twenty-four-hour ordeal. The uneven surface causing the trip and fall is often there before the “I do” but was missed. The marital counselor may touch on many factors to promote harmony, but what he would have handed the lovebirds remains tools that only they can use to build the future they desire. So, I ask you my beloved, “what is in your toolbox?”",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
export function getVideo(slug: string) {
  return firstSeason.find((v) => v.slug === slug);
}


export const faqLabel = "Frequently Asked Questions";

export const faq = [
  {
    q: "What exactly is the Inner Garden?",
    a: "Membership for individuals and families, granting access to an exclusive video library with videos on sensitive topics not available on YouTube, downloadable guides and workbooks, a free live monthly gathering, and warmer rates on private harmony conversations with Dr. Laiyemo. The Inner Garden is for adults only, eighteen years and older.",
  },
  {
    q: "Can my spouse and I share one membership?",
    a: "Yes. The family membership can include up to four family members for one price. Each member will have a unique email address and login information. The garden is for all.",
  },
  {
    q: "What is a harmony conversation?",
    a: "A private, unhurried 50-minute conversation with Dr. Laiyemo, educational and supportive in nature. It is not medical care, psychotherapy, or licensed counseling.",
  },
  {
    q: "I am not ready to bring my spouse. Can I come alone?",
    a: "Yes, you can. Many people begin alone, especially in strained seasons. What you share stays between you and Dr. Laiyemo.",
  },
  {
    q: "Is membership open now?",
    a: "Yes. Membership is open and available to individuals and families.",
  },
  {
    q: "Can I give membership as a gift?",
    a: "Yes. Please endeavour to give an annual family membership to your loved ones.",
  },
  {
    q: "What if it is not for us?",
    a: "You can cancel your membership at any time.",
  },
  {
    q: "Is this a substitute for professional help?",
    a: "No. Harmony conversations are educational and supportive services. If you or your loved one is having a crisis, please call or text 988 (USA) at any time for immediate help.",
  },
] as const;
