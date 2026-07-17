"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretDown, List, X } from "@phosphor-icons/react/dist/ssr";
import { nav, brand } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

// Header spec (DESIGN.md): ≤72px, single line at desktop, compresses to a
// frosted bar after 80px of scroll. About and Conversations open flyout panels
// on hover and focus; Esc closes. Below lg the nav folds into a full-screen
// botanical menu with staggered reveal, focus trap, and scroll lock.

function InterimLockup() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${brand.name}, home`}>
      {/* Interim brand glyph: a sun rising over the horizon line. A simple
          geometric mark; the real wordmark is a client input (PRD §21). */}
      <svg aria-hidden viewBox="0 0 32 32" className="h-8 w-8">
        <defs>
          <clipPath id="bg-horizon-clip">
            <rect x="0" y="0" width="32" height="17" />
          </clipPath>
        </defs>
        <circle cx="16" cy="17" r="7.5" fill="var(--gold)" clipPath="url(#bg-horizon-clip)" />
        <rect x="3" y="17" width="26" height="1.4" rx="0.7" fill="currentColor" opacity="0.85" />
      </svg>
      <span className="font-[family-name:var(--font-display)] text-[1.15rem] font-medium tracking-tight">
        Blissful Gardenz
      </span>
    </Link>
  );
}

function Flyout({
  item,
  active,
}: {
  item: (typeof nav.primary)[number];
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={`group relative px-1 py-2 text-[15px] font-medium text-current transition-colors hover:text-[color:var(--nav-accent)] ${
          active ? "text-[color:var(--nav-accent)]" : ""
        }`}
      >
        {item.label}
        <span
          aria-hidden
          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon} onFocus={openNow} onBlur={closeSoon}>
      <Link
        href={item.href}
        aria-expanded={open}
        className={`group relative flex items-center gap-1 px-1 py-2 text-[15px] font-medium text-current transition-colors hover:text-[color:var(--nav-accent)] ${
          active ? "text-[color:var(--nav-accent)]" : ""
        }`}
      >
        {item.label}
        <CaretDown
          size={12}
          weight="light"
          aria-hidden
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span
          aria-hidden
          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </Link>
      <div
        className={`absolute left-1/2 top-full z-50 min-w-52 -translate-x-1/2 pt-3 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
        }`}
      >
        <div
          className="flex flex-col gap-0.5 rounded-2xl border border-hairline bg-surface p-2"
          style={{ boxShadow: "0 18px 50px var(--shadow-tint)" }}
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="rounded-xl px-4 py-2.5 text-[15px] text-ink transition-colors hover:bg-raised hover:text-gold-text"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll lock + focus trap while open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = ref.current;
    const focusables = el?.querySelectorAll<HTMLElement>("a, button");
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  let itemIndex = 0;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-brand text-[#F3E9DE] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex h-16 items-center justify-between px-5">
        <span className="font-[family-name:var(--font-display)] text-lg">Blissful Gardenz</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20"
        >
          <X size={18} weight="light" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-6 pb-12 pt-6">
        {nav.primary.map((item) => (
          <div key={item.href} className="border-b border-white/10 pb-4 pt-3">
            <Link
              href={item.href}
              onClick={onClose}
              style={{ animationDelay: `${itemIndex++ * 60}ms` }}
              className={`animate-rise block font-[family-name:var(--font-display)] text-3xl ${
                pathname === item.href ? "text-gold" : ""
              }`}
            >
              {item.label}
            </Link>
            {item.children ? (
              <div className="mt-3 flex flex-col gap-2 pl-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    style={{ animationDelay: `${itemIndex++ * 60}ms` }}
                    className={`animate-rise text-[15px] text-white/75 ${
                      pathname === child.href ? "text-gold" : ""
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <Link
          href={nav.membership.href}
          onClick={onClose}
          style={{ animationDelay: `${itemIndex++ * 60}ms` }}
          className="animate-rise mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-[15px] font-medium text-[#251A1D]"
        >
          {nav.membership.label}
        </Link>
        <p className="mt-10 text-sm text-white/50">{brand.motto}</p>
      </nav>
    </div>
  );
}

export function SiteHeader() {
  const [compressed, setCompressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Rationale for a scroll listener here (vs the banned pattern): this is a
    // single boolean threshold, throttled by the browser via passive listener,
    // not a continuous value driving React state per frame.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCompressed(window.scrollY > 80));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50" data-compressed={compressed ? "1" : "0"}>
      {/* The blur lives on this inner bar, never on <header> itself: a
          backdrop-filter ancestor would become the containing block for the
          fixed full-screen mobile menu and squash it into the bar. */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          compressed
            ? "border-b border-hairline bg-[color-mix(in_srgb,var(--canvas)_82%,transparent)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <InterimLockup />
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.primary.map((item) => (
            <Flyout key={item.href} item={item} active={pathname.startsWith(item.href)} />
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={nav.membership.href}
            className="hidden h-10 items-center rounded-full bg-gold px-5 text-[14px] font-medium text-[#251A1D] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] motion-reduce:transition-none sm:inline-flex"
          >
            {nav.membership.label}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline lg:hidden"
          >
            <List size={18} weight="light" />
          </button>
        </div>
      </div>
      </div>
      {menuOpen ? <MobileMenu onClose={close} /> : null}
    </header>
  );
}
