"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretDown, DotsThree, X } from "@phosphor-icons/react/dist/ssr";
import { nav, brand } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

// Header spec (DESIGN.md v4, reference: unseen.co): ≤72px, single line at
// desktop, compresses to a frosted bar after 80px of scroll. Left: lowercase
// two-tone wordmark. Right: quiet links, theme toggle, membership pill, and
// a round dots button that opens the full-screen menu at every breakpoint.

function InterimLockup() {
  return (
    <Link href="/" className="group flex items-baseline gap-1.5" aria-label={`${brand.name}, home`}>
      {/* Interim lockup, unseen.co two-tone: quiet grotesque + didone italic.
          The real mark remains a client input (PRD §21). */}
      <span className="text-[1.2rem] font-medium lowercase tracking-[-0.01em]">blissful</span>
      <span className="font-[family-name:var(--font-display)] text-[1.3rem] font-[440] lowercase italic tracking-[-0.02em]">
        gardenz
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
          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </Link>
      {/* Flyout pops from its trigger: origin-top scale + rise reads as a
          physical unfold rather than a fade-in-place */}
      <div
        className={`absolute left-1/2 top-full z-50 min-w-52 origin-top -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-1 scale-[0.97] opacity-0"
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

  // Scroll lock + focus trap while open. The lock compensates for the
  // scrollbar it removes so the page never shifts sideways (classic
  // scrollbars; overlay scrollbars measure 0).
  useEffect(() => {
    const previous = document.body.style.overflow;
    const previousPad = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
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
      document.body.style.paddingRight = previousPad;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  let itemIndex = 0;

  return (
    <div
      ref={ref}
      className="animate-menu-in fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-brand text-brand-ink"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex h-16 items-center justify-between px-5 lg:px-8">
        <span className="flex items-baseline gap-1.5">
          <span className="text-lg font-medium lowercase">blissful</span>
          <span className="font-[family-name:var(--font-display)] text-xl lowercase italic">gardenz</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:bg-white/10"
        >
          <X size={18} weight="light" />
        </button>
      </div>
      <nav className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-1 px-6 pb-12 pt-6">
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
                    className={`animate-rise text-[15px] text-brand-ink-muted ${
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
          className="animate-rise mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-[15px] font-medium text-[#0f2e22]"
        >
          {nav.membership.label}
        </Link>
        <p className="mt-10 text-sm text-brand-ink-muted/70">{brand.motto}</p>
      </nav>
    </div>
  );
}

export function SiteHeader() {
  const [compressed, setCompressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
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

  // Closing hands keyboard focus back to the trigger (dialog pattern).
  const close = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50" data-compressed={compressed ? "1" : "0"}>
      {/* On scroll the bar detaches from the top edge and becomes a floating
          glass island (frosted, ringed, softly shadowed). The blur lives on
          this inner bar, never on <header> itself: a backdrop-filter ancestor
          would become the containing block for the fixed full-screen menu and
          squash it into the bar. */}
      <div
        className={`transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          compressed ? "px-3 pt-3 lg:px-6 lg:pt-4" : "px-0 pt-0"
        }`}
      >
        <div
          className={`mx-auto flex h-16 items-center justify-between gap-6 transition-[max-width,background-color,border-color,box-shadow,border-radius,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            compressed
              ? "max-w-5xl rounded-full border border-[color-mix(in_srgb,var(--ink)_12%,transparent)] bg-[color-mix(in_srgb,var(--canvas)_80%,transparent)] px-5 shadow-[0_16px_50px_-12px_var(--shadow-tint),inset_0_1px_0_color-mix(in_srgb,white_55%,transparent)] backdrop-blur-xl lg:px-6"
              : "max-w-7xl rounded-none border border-transparent px-5 shadow-none lg:px-8"
          }`}
        >
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
              className="hidden h-11 items-center rounded-full bg-gold px-5 text-[14px] font-medium text-[#0f2e22] shadow-[0_6px_18px_-6px_color-mix(in_srgb,var(--gold)_60%,transparent)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] active:duration-75 motion-reduce:transition-none sm:inline-flex"
            >
              {nav.membership.label}
            </Link>
            {/* The unseen.co dots button: the full menu, at every breakpoint.
                current/10 hover keeps the fill legible in both header color
                regimes (ink over canvas, ivory over the dark hero film). */}
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-current/25 transition-[background-color,transform] duration-300 hover:bg-current/10 active:scale-[0.94] active:duration-75 motion-reduce:transition-none"
            >
              <DotsThree size={22} weight="bold" />
            </button>
          </div>
        </div>
      </div>
      {menuOpen ? <MobileMenu onClose={close} /> : null}
    </header>
  );
}
