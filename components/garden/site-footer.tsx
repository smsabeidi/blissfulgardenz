import Link from "next/link";
import { brand, footer } from "@/content/site";
import { NewsletterForm } from "./newsletter-form";

// Footer: dusk surface in both themes (the garden at evening), sitemap columns,
// Seeds of Harmony capture, motto lockup, quiet credits.
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#0B1512] text-[#E9E4D6]">
      {/* Botanical silhouette band along the footer top */}
      <svg
        aria-hidden
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-10 w-full text-[#152922]"
      >
        <path
          fill="currentColor"
          d="M0 60V38c40-6 70-22 110-20s60 16 105 14 75-24 120-22 70 18 115 16 80-22 125-20 65 14 110 14 85-20 130-18 60 16 105 16 90-22 135-20 70 18 110 16 55-12 95-14 55 4 80 8v46z"
        />
      </svg>
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-24 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <svg aria-hidden viewBox="0 0 32 32" className="h-9 w-9">
                <defs>
                  <clipPath id="bg-horizon-clip-footer">
                    <rect x="0" y="0" width="32" height="17" />
                  </clipPath>
                </defs>
                <circle cx="16" cy="17" r="7.5" fill="#D8B23A" clipPath="url(#bg-horizon-clip-footer)" />
                <rect x="3" y="17" width="26" height="1.4" rx="0.7" fill="#E9E4D6" opacity="0.85" />
              </svg>
              <span className="font-[family-name:var(--font-display)] text-xl">Blissful Gardenz</span>
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl italic text-[#D8B23A]">
              {brand.motto}
            </p>
            <div className="mt-2 flex flex-col gap-3">
              <p className="text-[15px] font-medium">{footer.newsletterTitle}</p>
              <p className="max-w-sm text-[14px] text-white/60">{footer.newsletterPromise}</p>
              <NewsletterForm context="footer" buttonLabel="Subscribe" tone="dark"
                successTitle="Welcome to Seeds of Harmony."
                successBody="The first letter will find you soon." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
                <p className="text-meta text-[#D8B23A]/80">{col.title}</p>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[15px] text-white/75 transition-colors hover:text-[#E3C25B]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
          </p>
          <p>Harmony conversations are educational and supportive, not medical care or licensed counseling.</p>
        </div>
      </div>
    </footer>
  );
}
