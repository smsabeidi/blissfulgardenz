// The Three Guys Talking trilogy. Every fact below was verified against the live
// Amazon.com product pages, Audible listings, and the physical cover art on
// 2026-07-16. Synopses are paraphrased, never copied. Do not edit facts without
// re-verifying against the retailer pages.

export type Book = {
  slug: string;
  order: 1 | 2 | 3;
  title: string;
  subtitle: string;
  accent: "gold" | "sage" | "terracotta";
  cover: string;
  coverAlt: string;
  publishedYear: number;
  pages: number;
  publisher: string;
  isbn13: string;
  synopsis: string[];
  themes: string;
  formats: {
    paperback: { price: string; url: string };
    kindle: { price: string; url: string };
    audiobook: { duration: string; narrator: string; url: string };
  };
  rating: { stars: number; note: string };
};

export const series = {
  name: "Three Guys Talking",
  tagline: "Three friends. Three marriages. One honest conversation.",
  description:
    "A seriocomic trilogy told through the eyes of three friends, Ray Marshall, Kamal Brown, and Adam Gray, as they navigate marriage, fatherhood, and second chances. Published by Blissful Gardenz Inc, the same garden this site grows from.",
  readingOrderNote:
    "Read them in order. Each book picks up the conversation where the last one paused.",
} as const;

export const books: Book[] = [
  {
    slug: "my-wife-or-my-childrens-mother",
    order: 1,
    title: "Three Guys Talking",
    subtitle: "My Wife or My Children's Mother?",
    accent: "gold",
    cover: "/images/covers/book1.jpg",
    coverAlt:
      "Book one cover: three wicker chairs behind a glass table where two neckties rest with small flowers, by an overcast sea.",
    publishedYear: 2017,
    pages: 234,
    publisher: "Blissful Gardenz Inc",
    isbn13: "978-0999635612",
    synopsis: [
      "Ray has been married thirteen years and loves his four children deeply. What he misses is his wife, Desiree, who seems to pour everything into motherhood and nothing into the two of them.",
      "His friend Kamal has remarried, yet his ex-wife keeps returning with their only child as leverage. And Adam, a widower at forty-two, stands between a twenty-year-old who delights him and a thirty-nine-year-old who truly loves him.",
      "Around one table, three friends talk it out. Decide with the head, or with the heart?",
    ],
    themes:
      "Readers describe it as insightful, engaging, and funny, and praise how gently it handles a complicated subject.",
    formats: {
      paperback: {
        price: "$14.99",
        url: "https://www.amazon.com/Three-Guys-Talking-Childrens-Mother/dp/0999635611",
      },
      kindle: {
        price: "$2.99",
        url: "https://www.amazon.com/dp/B077ZM4Q41",
      },
      audiobook: {
        duration: "7 hrs 24 min",
        narrator: "Drew Alan Baker",
        url: "https://www.audible.com/pd/Three-Guys-Talking-Audiobook/B0DWPTPDMY",
      },
    },
    rating: { stars: 5.0, note: "5.0 on Amazon" },
  },
  {
    slug: "when-ladies-fight-back",
    order: 2,
    title: "Three Guys Talking 2",
    subtitle: "When Ladies Fight Back",
    accent: "terracotta",
    cover: "/images/covers/book2.jpg",
    coverAlt:
      "Book two cover: a blue pair and a pink pair of boxing gloves around a heap of mingled shoes, framed on a blush ground.",
    publishedYear: 2019,
    pages: 218,
    publisher: "Blissful Gardenz Inc",
    isbn13: "978-0999635650",
    synopsis: [
      "The women get their innings. Desiree watches Ray try chores, fitness, and fresh courtship to win her back, and decides what his effort is worth.",
      "Adam's family dinners with each prospective bride turn wonderfully awkward: one father turns out to be his old mentor, one mother his middle-school classmate.",
      "And Kamal makes the boldest move of all, asking his wife to face his relentless ex herself. Two determined women, one head-on collision.",
    ],
    themes: "A brisk middle chapter that readers rate highly for its humor and turnabout.",
    formats: {
      paperback: {
        price: "$14.99",
        url: "https://www.amazon.com/Three-Guys-Talking-Ladies-fight/dp/0999635654",
      },
      kindle: {
        price: "$2.99",
        url: "https://www.amazon.com/dp/B07ZV4RVX8",
      },
      audiobook: {
        duration: "6 hrs 21 min",
        narrator: "Drew Alan Baker",
        url: "https://www.audible.com/pd/When-Ladies-Fight-Back-Audiobook/B0DWR8DK2F",
      },
    },
    rating: { stars: 4.7, note: "4.7 on Amazon" },
  },
  {
    slug: "the-romantic-tragedy",
    order: 3,
    title: "Three Guys Talking 3",
    subtitle: "The Romantic Tragedy",
    accent: "sage",
    cover: "/images/covers/book3.jpg",
    coverAlt:
      "Book three cover: a framed view of Niagara Falls above a wooden boardwalk receding through tall grass.",
    publishedYear: 2020,
    pages: 209,
    publisher: "Blissful Gardenz Inc",
    isbn13: "978-0999635681",
    synopsis: [
      "The conversation reaches its finale. Adam is out of runway: one love is drifting away and the other will not wait forever, so a choice must be made before it makes itself.",
      "Kamal is pressed between the ache of infertility at home and a fight for time with the child he already has.",
      "And Ray, with a new baby in the house and Desiree back at work, stands at his breaking point: keep laboring at the marriage, or walk away.",
    ],
    themes: "The finale readers rate highest of the three, woven through with original poetry.",
    formats: {
      paperback: {
        price: "$14.99",
        url: "https://www.amazon.com/Three-Guys-Talking-Romantic-Tragedy/dp/0999635689",
      },
      kindle: {
        price: "$2.99",
        url: "https://www.amazon.com/dp/B08KR7H2VS",
      },
      audiobook: {
        duration: "5 hrs 31 min",
        narrator: "Drew Alan Baker",
        url: "https://www.audible.com/pd/Three-Guys-Talking-3-The-Romantic-Tragedy-Audiobook/B0DWQ26W4R",
      },
    },
    rating: { stars: 5.0, note: "5.0 on Amazon" },
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
