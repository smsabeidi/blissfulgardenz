"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { BloomButton } from "@/components/garden/buttons";
import { ctaLabels } from "@/content/site";

// Sticky join bar: appears once the visitor has scrolled past the tiers
// (IntersectionObserver on the sentinel rendered by this component), fixed to
// the bottom on a frosted surface. While visible it sets
// body[data-joinbar="1"], which suppresses the Horizon progress line (the
// fixed-chrome exclusion rule: one fixed accessory besides the header, max).
// Hidden below sm to protect small viewports; dismissible for the session.

export function JoinBar() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [pastTiers, setPastTiers] = useState(false);
  const [wideEnough, setWideEnough] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // The sm gate lives in JS as well as CSS so the body flag (and with it the
  // progress-line suppression) never applies while the bar is display:none.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setWideEnough(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) =>
        setPastTiers(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = pastTiers && wideEnough && !dismissed;

  useEffect(() => {
    if (visible) {
      document.body.dataset.joinbar = "1";
    } else {
      delete document.body.dataset.joinbar;
    }
    return () => {
      delete document.body.dataset.joinbar;
    };
  }, [visible]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <div
        inert={!visible}
        className={`fixed inset-x-0 bottom-0 z-50 hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:block ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="border-t border-hairline bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 lg:px-8">
            <p className="whitespace-nowrap text-[15px] text-ink">
              <span className="font-medium">The Inner Garden</span>
              <span aria-hidden className="mx-2 text-gold-text">
                &middot;
              </span>
              <span className="text-ink-muted">founding list open</span>
            </p>
            <div className="flex items-center gap-2">
              <BloomButton href="#founding">{ctaLabels.foundingList}</BloomButton>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Hide this bar"
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:bg-raised hover:text-ink motion-reduce:transition-none"
              >
                <X aria-hidden size={18} weight="light" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
