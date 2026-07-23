// Single source of truth for brand constants, navigation, and copy guardrails.
// Shaped to mirror future Sanity document types (PRD §11.3 content_index) so the
// CMS migration at M3 is data entry, not refactoring.

export const brand = {
  name: "Blissful Gardenz",
  legalName: "Blissful Gardenz Inc",
  motto: "Harmony on the horizon.",
  mission: "To promote enduring healthy relationships",
  description:
    "A garden of bliss for the people: a safe space for facilitated family harmony conversations, and resources that build enduring healthy relationships.",
  founder: {
    name: "Dr. Adeyinka Laiyemo",
    coverName: "Adeyinka O. Laiyemo",
    // Client-provided claims (PRD §3) + publicly verified facts only.
    credentials: [
      "Board-certified physician with over thirty-five years in medicine",
      "Two decades of family-harmony advocacy",
      "Author of the Three Guys Talking trilogy",
      "Associate Professor of Medicine, Howard University College of Medicine",
    ],
    portrait: "/images/dr-laiyemo-portrait.jpg",
    amazonAuthorUrl: "https://www.amazon.com/Adeyinka-Laiyemo/e/B0H68QFKDH",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: {
  primary: NavItem[];
  membership: { label: string; href: string };
} = {
  primary: [
    {
      label: "About",
      href: "/about",
      children: [
        { label: "Our Story", href: "/about" },
        { label: "Dr. Laiyemo", href: "/about/dr-laiyemo" },
      ],
    },
    {
      label: "Conversations",
      href: "/conversations",
      children: [
        { label: "Premarital", href: "/conversations/premarital" },
        { label: "Marital", href: "/conversations/marital" },
        { label: "Rebuilding", href: "/conversations/postmarital" },
        { label: "How It Works", href: "/conversations/how-it-works" },
      ],
    },
    { label: "Books", href: "/books" },
    { label: "Watch & Listen", href: "/watch" },
    { label: "Journal", href: "/journal" },
  ],
  membership: { label: "The Inner Garden", href: "/membership" },
};

export const footer = {
  columns: [
    {
      title: "Visit",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Dr. Laiyemo", href: "/about/dr-laiyemo" },
        { label: "Journal", href: "/journal" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Grow",
      links: [
        { label: "Harmony Conversations", href: "/conversations" },
        { label: "The Trilogy", href: "/books" },
        { label: "Watch & Listen", href: "/watch" },
      ],
    },
    {
      title: "Belong",
      links: [
        { label: "The Inner Garden", href: "/membership" },
        { label: "Gift a Membership", href: "/membership/gift" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/legal/privacy" },
        { label: "Terms", href: "/legal/terms" },
        { label: "Disclaimer", href: "/legal/disclaimer" },
        { label: "Cookies", href: "/legal/cookies" },
      ],
    },
  ],
  newsletterTitle: "Seeds of Harmony",
  newsletterPromise: "A monthly letter from Dr. Laiyemo. Thoughtful, brief, and free.",
} as const;

// One CTA label per intent, page-wide (design contract). Never say "Join"
// while delivering a mailing list.
export const ctaLabels = {
  membership: "Explore Membership",
  foundingList: "Join the founding list",
  meetFounder: "Meet Dr. Laiyemo",
  bookConversation: "Begin a conversation",
  giftCapture: "Be first to give it",
} as const;

// Claims style sheet (PRD §12.2). Enforced across all copy in this layer.
// BANNED words on any public page: therapy, therapist, counseling, counselor,
// treatment, cure, diagnose, diagnosis, patient, clinical outcomes, medical advice.
// REQUIRED framing: educational and supportive "harmony conversations".
export const disclaimer = {
  short:
    "Harmony conversations are educational and supportive in nature. They are not medical care, psychotherapy, or licensed counseling, and they are not an emergency service.",
  crisis:
    "If you or someone you love is in crisis, please call or text 988 (US) to reach trained support, any hour of any day.",
} as const;

// PRD §14 analytics event taxonomy. Wired as no-op stubs this phase.
export type TrackEvent =
  | "newsletter_signup"
  | "membership_view"
  | "book_click"
  | "audio_sample_play"
  | "gathering_rsvp"
  | "booking_started"
  | "gift_interest"
  | "video_poster_open"
  | "founding_list_signup";
