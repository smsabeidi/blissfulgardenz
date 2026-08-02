import type { ReactNode } from "react";

// The bits every form in the garden was re-declaring.
//
// The label class, the field shell, and the error line existed three times over
// before this file (the contact form, the conversation request, and the gate),
// each a near-copy of the others. The sign-in work added four more forms, which
// made "one more copy" the wrong answer.
//
// Deliberately small: no <Field> wrapper, no controlled-input abstraction. Each
// form still writes its own <label> and <input> so that ids, autoComplete, and
// inputMode stay visible at the call site, where the accessibility decisions
// actually live. This file owns appearance, not structure.
//
// The three existing forms are untouched on purpose — moving them is a separate
// change and does not belong in a diff about sign-in.

export const labelClasses = "text-[13px] font-medium text-ink-muted";

export const fieldBase =
  "w-full rounded-xl border bg-surface px-4 text-ink outline-none transition-shadow placeholder:text-ink-muted/70 focus:ring-2 focus:ring-[var(--focus-ring)]";

/** The standard text input: 48px tall, hairline border, red when it is wrong. */
export function fieldClasses(invalid?: boolean): string {
  return `h-12 text-[15px] ${fieldBase} ${invalid ? "border-error" : "border-hairline"}`;
}

// Quiet text controls, sized to the 44px minimum target. They go soft rather
// than disabled while unavailable: disabling the control a keyboard visitor is
// standing on throws their focus to the top of the document.
export const textActionClasses =
  "inline-flex min-h-11 items-center rounded-full px-1 text-[14px] font-medium text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current aria-disabled:cursor-default aria-disabled:text-ink-muted aria-disabled:no-underline motion-reduce:transition-none";

/** Paired with `aria-describedby={id}` and `aria-invalid` on the field itself. */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-[13px] leading-relaxed text-error">
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="mt-0.5 h-3.5 w-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

/** A whole-form failure, as opposed to one field being wrong. */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-error/40 bg-raised px-4 py-3 text-[14px] leading-relaxed text-error"
    >
      {children}
    </p>
  );
}
