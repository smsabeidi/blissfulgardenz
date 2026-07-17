import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HorizonDraw } from "@/components/garden/reveal";
import { QuietButton } from "@/components/garden/buttons";
import { articles, getArticle } from "@/content/library";
import { brand, ctaLabels } from "@/content/site";

// Article template (PRD §7.7): a letter, not a blog post. Centered measure
// column, Source Serif long-form with a drop cap (prose-garden), author block,
// two compact related rows, and one quiet membership interstitial. No pull
// quote, no share bar: the reading is the experience.

const SITE_URL = "https://blissfulgardenz.com";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Letter not found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    articleSection: article.pillar,
    timeRequired: `PT${article.readMinutes}M`,
    url: `${SITE_URL}/journal/${article.slug}`,
    mainEntityOfPage: `${SITE_URL}/journal/${article.slug}`,
    author: {
      "@type": "Person",
      name: brand.founder.name,
      url: `${SITE_URL}/about/dr-laiyemo`,
    },
    publisher: {
      "@type": "Organization",
      name: brand.legalName,
      url: SITE_URL,
    },
  };

  return (
    <article className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Title + meta row */}
        <header className="animate-rise flex flex-col items-center gap-6 text-center">
          <p className="text-meta text-gold-text">
            {article.pillar} &middot; {article.readMinutes} minute read
          </p>
          <h1 className="text-display-xl text-balance">{article.title}</h1>
          <HorizonDraw className="max-w-36" />
        </header>

        {/* The letter itself */}
        <div className="prose-garden mx-auto mt-14">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Author block */}
        <footer className="mx-auto mt-14 flex max-w-[66ch] items-center gap-4 border-t border-hairline pt-8">
          <Image
            src={brand.founder.portrait}
            alt="Portrait of Dr. Adeyinka Laiyemo."
            width={96}
            height={96}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-[15px] font-medium">{brand.founder.name}</p>
            <p className="text-[13px] text-ink-muted">Founder of {brand.name}</p>
          </div>
        </footer>
      </div>

      {/* Related letters: compact link rows */}
      <aside aria-labelledby="related-title" className="mx-auto mt-24 max-w-3xl">
        <h2 id="related-title" className="text-display-sm">
          Keep reading
        </h2>
        <div className="mt-6 flex flex-col">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/journal/${r.slug}`}
              className="group flex items-baseline justify-between gap-6 border-t border-hairline py-5 last:border-b"
            >
              <div className="flex flex-col gap-1">
                <p className="font-[family-name:var(--font-display)] text-xl leading-snug group-hover:text-gold-text">
                  {r.title}
                </p>
                <p className="text-[13px] text-ink-muted">
                  {r.pillar} &middot; {r.readMinutes} minute read
                </p>
              </div>
              <span
                aria-hidden
                className="text-gold-text transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* One quiet membership interstitial */}
        <div className="mt-16 flex flex-col gap-5 rounded-[2rem] border border-hairline px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-display-sm">The Inner Garden opens soon.</p>
            <p className="text-[15px] text-ink-muted">Founding members read everything first.</p>
          </div>
          <QuietButton href="/membership#founding" className="shrink-0">
            {ctaLabels.foundingList}
          </QuietButton>
        </div>
      </aside>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </article>
  );
}
