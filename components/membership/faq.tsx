"use client";

import { useId, useState } from "react";
import { faq } from "@/content/library";

// FaqList per DESIGN.md anatomy: borderless accordion (no container boxes),
// border-b hairline separators, + / - glyph rotating, one item open at a
// time. Buttons carry aria-expanded; panels are labelled regions. The panel
// collapse animates grid rows (transform-free, no height thrash) and is
// static under reduced motion.

function ToggleGlyph({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative mt-1 h-4 w-4 shrink-0 text-gold-text">
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <span
        className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? "rotate-90" : ""
        }`}
      />
    </span>
  );
}

export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div>
      {faq.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${baseId}-faq-q-${i}`;
        const panelId = `${baseId}-faq-a-${i}`;
        return (
          <div key={item.q} className="border-b border-hairline">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex min-h-11 w-full items-start justify-between gap-6 py-6 text-left text-[17px] font-medium text-ink"
              >
                {item.q}
                <ToggleGlyph open={open} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                open ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-body max-w-[62ch] pb-6 text-ink-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
