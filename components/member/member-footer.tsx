import Link from "next/link";
import { brand, disclaimer } from "@/content/site";

// The quietest thing on the page. A member should be able to find the legal
// pages and a human without ever being pulled out of what they came here for,
// so this is meta-sized text, muted, and carries no navigation of its own.
//
// disclaimer.short is imported rather than restated: the educational-nature
// sentence is legal language with one source of truth in content/site.ts, and
// a second copy here would drift the first time counsel revises it.

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  // min-h-11 keeps a 44px target around 13px text.
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-ink-muted underline decoration-hairline underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-current"
    >
      {children}
    </Link>
  );
}

export function MemberFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      {/* pb-28 on small screens clears the fixed bottom bar in MemberNav. */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 pb-28 pt-10 text-[13px] leading-relaxed text-ink-muted lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:px-8 lg:pb-14">
        <p className="max-w-md">{disclaimer.short}</p>

        <div className="flex flex-col gap-1 lg:items-end lg:text-right">
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6">
            <FooterLink href="/legal/privacy">Privacy</FooterLink>
            <FooterLink href="/legal/terms">Terms</FooterLink>
          </nav>
          <p>
            A question, or something not working: <FooterLink href="/contact">write to us</FooterLink>.
          </p>
          <p className="text-ink-muted/80">
            © {new Date().getFullYear()} {brand.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
