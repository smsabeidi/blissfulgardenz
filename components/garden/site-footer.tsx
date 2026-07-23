import Link from "next/link";
import { brand, footer } from "@/content/site";
import { NewsletterForm } from "./newsletter-form";
import { BackToTop } from "./back-to-top";
import { MaskRise } from "./motion-reveals";

// Footer: the garden at dusk. The same golden sun that rises in the hero sets
// here, glowing up from behind the monumental wordmark, which rests on a gold
// horizon line. The page opens and closes on the same horizon. Quiet sitemap
// and the Seeds of Harmony capture sit above; legal meta and a round
// back-to-top accessory close the baseline.
export function SiteFooter() {
  return (
    <footer
      data-ground="dark"
      className="relative isolate overflow-hidden bg-[#0f2e22] text-brand-ink"
    >
      {/* Depth: the ground deepens toward the foot of the page */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(to bottom, #0f2e22 0%, #0a1f17 100%)" }}
      />
      {/* The setting sun: a soft gold radial rising from behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[7%] left-1/2 -z-10 h-[66vw] w-[66vw] max-h-[560px] max-w-[940px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--gold) 30%, transparent) 0%, color-mix(in srgb, var(--gold) 10%, transparent) 38%, transparent 64%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 lg:px-8 lg:pt-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <p className="text-[15px] font-medium">{footer.newsletterTitle}</p>
            <p className="max-w-sm text-[14px] text-brand-ink-muted">{footer.newsletterPromise}</p>
            <NewsletterForm
              context="footer"
              buttonLabel="Subscribe"
              tone="dark"
              successTitle="Welcome to Seeds of Harmony."
              successBody="The first letter will find you soon."
            />
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
                <p className="text-meta text-[#e3c25b]/85">{col.title}</p>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="w-fit text-[15px] text-brand-ink-muted transition-colors duration-200 hover:text-[#e3c25b]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        {/* The monumental wordmark, resting on the gold horizon, the setting
            sun glowing up behind it. The footer's one grand gesture. */}
        <div className="relative mt-24 lg:mt-32">
          {/* The horizon line the wordmark sits on */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[4%] bottom-[0.3em] h-px bg-gradient-to-r from-transparent via-[#c9a227]/70 to-transparent"
          />
          <p
            aria-hidden
            className="relative select-none whitespace-nowrap pb-[0.14em] text-center font-[family-name:var(--font-display)] text-[clamp(2.75rem,10vw,9rem)] font-[440] lowercase leading-[1.05] tracking-[-0.04em] text-brand-ink"
          >
            <MaskRise amount={0.4}>
              blissful <em className="italic text-[#e4ce7f]">gardenz</em>
            </MaskRise>
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/12 pt-6 text-[13px] text-brand-ink-muted/70 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <p>
            © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
          </p>
          <p className="max-w-md">
            Harmony conversations are educational and supportive, not medical care or licensed
            counseling.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
