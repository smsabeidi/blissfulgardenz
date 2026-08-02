import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { isStaff } from "@/lib/staff";
import { brand } from "@/content/site";

// The desk.
//
// Deliberately its own route group rather than a corner of /garden. The member
// area is somewhere you go to read and think; this is somewhere you go to work.
// Sharing chrome between the two would put a roster of paying customers one
// mis-click from a page about tending your marriage.
//
// Sign-in is enforced by middleware, staff-ness by the row-level policies on
// every table behind it. The check below decides what to draw, not what is
// permitted: a member who reaches this URL gets a plain "not yours" page rather
// than a broken desk full of empty tables.

export const metadata: Metadata = {
  title: { default: "Desk", template: "%s · Desk" },
  robots: { index: false, follow: false },
};

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const staff = await isStaff();

  if (!staff) {
    return (
      <main id="main" className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5">
        <h1 className="text-display">Not your desk</h1>
        <p className="text-lede mt-4">
          This is the {brand.name} team&rsquo;s working area. If you are looking for your
          membership, the garden gate is below.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/garden" className="text-gold-text underline underline-offset-4">
            The Inner Garden
          </Link>
          <Link href="/" className="text-ink-muted underline underline-offset-4">
            Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 lg:px-8">
          <Link href="/admin" className="flex items-baseline gap-1.5">
            <span className="text-[1.05rem] font-medium lowercase">blissful</span>
            <span className="font-[family-name:var(--font-display)] text-[1.15rem] font-[520] lowercase italic">
              desk
            </span>
          </Link>
          <nav aria-label="Desk" className="flex flex-wrap items-center gap-6">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="min-h-11 text-[15px] text-ink-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current motion-reduce:transition-none"
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/garden"
            className="ml-auto min-h-11 text-[14px] text-ink-muted underline decoration-transparent underline-offset-4 hover:decoration-current"
          >
            Leave the desk
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}
