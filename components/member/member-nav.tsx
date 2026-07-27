"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChatCircle, Flower, LockKey, User } from "@phosphor-icons/react/dist/ssr";

// The member-area nav. This is the app register, not the marketing header:
// no flyouts, no full-screen menu, no frosted-glass compression, no theme
// theatrics. Four destinations, an account affordance, a way out.
//
// Client only because the active destination needs the pathname. Everything
// else here is static markup.

type Destination = {
  href: string;
  label: string;
  /** Shown in the mobile bar only. Desktop stays typographic. */
  icon: React.ReactNode;
};

const DESTINATIONS: Destination[] = [
  { href: "/garden", label: "The Garden", icon: <Flower size={22} weight="light" aria-hidden /> },
  { href: "/garden/library", label: "Library", icon: <BookOpen size={22} weight="light" aria-hidden /> },
  { href: "/garden/vault", label: "Vault", icon: <LockKey size={22} weight="light" aria-hidden /> },
  {
    href: "/garden/conversations",
    label: "Conversations",
    icon: <ChatCircle size={22} weight="light" aria-hidden />,
  },
];

// /garden is the parent of every other destination, so it can only match
// exactly or it would light up on every page in the area.
function isCurrent(pathname: string, href: string): boolean {
  return href === "/garden" ? pathname === "/garden" : pathname.startsWith(href);
}

export function MemberNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link
            href="/garden"
            aria-label="The Inner Garden, home"
            className="flex shrink-0 items-baseline gap-1.5 text-ink"
          >
            <span className="text-[1.05rem] font-medium lowercase tracking-[-0.01em]">the inner</span>
            <span className="font-[family-name:var(--font-display)] text-[1.2rem] font-[520] lowercase italic tracking-[-0.01em]">
              garden
            </span>
          </Link>

          <nav aria-label="Garden" className="hidden items-center gap-1 lg:flex">
            {DESTINATIONS.map((d) => {
              const current = isCurrent(pathname, d.href);
              return (
                <Link
                  key={d.href}
                  href={d.href}
                  aria-current={current ? "page" : undefined}
                  className={`relative flex h-11 items-center rounded-full px-4 text-[15px] transition-colors duration-200 ${
                    current ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {d.label}
                  {current ? (
                    <span aria-hidden className="absolute inset-x-4 bottom-2 h-px bg-gold" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/account"
              className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[14px] text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              <User size={20} weight="light" aria-hidden />
              <span className="hidden sm:inline">Account</span>
            </Link>
            {/* A plain POST, so signing out works with or without JavaScript. */}
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="flex h-11 items-center rounded-full px-3 text-[14px] text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile: the same four destinations, always one thumb away. A hamburger
          would hide the whole product behind a second tap. MemberFooter carries
          the bottom padding that keeps content clear of this bar. */}
      <nav
        aria-label="Garden sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto flex w-full max-w-lg items-stretch">
          {DESTINATIONS.map((d) => {
            const current = isCurrent(pathname, d.href);
            return (
              <li key={d.href} className="flex-1">
                <Link
                  href={d.href}
                  aria-current={current ? "page" : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-center transition-colors duration-200 ${
                    current ? "text-gold-text" : "text-ink-muted"
                  }`}
                >
                  {d.icon}
                  <span className="text-[11px] leading-tight tracking-[0.04em]">{d.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
