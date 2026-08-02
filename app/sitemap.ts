import type { MetadataRoute } from "next";
import { articles, firstSeason } from "@/content/library";
import { books } from "@/content/books";

// Sitemap for all public routes, with dynamic slugs sourced from the content
// layer so new books, films, or letters appear without touching this file.

// Canonical host comes from the same env var the rest of the app redirects to.
// It was hard-coded to the apex, which 308s to www, so every URL submitted to
// search engines was a redirect rather than the page itself.
const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blissfulgardenz.com").replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about/dr-laiyemo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/conversations", priority: 0.9, changeFrequency: "monthly" },
    { path: "/conversations/premarital", priority: 0.8, changeFrequency: "monthly" },
    { path: "/conversations/marital", priority: 0.8, changeFrequency: "monthly" },
    { path: "/conversations/postmarital", priority: 0.8, changeFrequency: "monthly" },
    { path: "/conversations/how-it-works", priority: 0.7, changeFrequency: "monthly" },
    { path: "/books", priority: 0.8, changeFrequency: "monthly" },
    { path: "/watch", priority: 0.7, changeFrequency: "weekly" },
    { path: "/journal", priority: 0.7, changeFrequency: "weekly" },
    { path: "/membership", priority: 0.9, changeFrequency: "monthly" },
    { path: "/membership/gift", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
    { path: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/disclaimer", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/cookies", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...books.map((book) => ({
      url: `${BASE}/books/${book.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Only films the public can actually open. generateStaticParams filters
    // locked films out, so listing them here submitted three 404s to Google.
    ...firstSeason.filter((video) => !video.locked).map((video) => ({
      url: `${BASE}/watch/${video.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...articles.map((article) => ({
      url: `${BASE}/journal/${article.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
