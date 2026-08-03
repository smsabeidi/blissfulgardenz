"use client";

import { useActionState, useEffect } from "react";
import { joinFoundingList } from "@/app/actions";
import { track } from "@/lib/track";

// Seeds of Harmony / founding-list capture. One field, label above, inline
// error below, success blooms in place. Double-submit guarded by isPending.
//
// ABOUT `tone`, WHICH IS NOT DECORATION:
// This form appears on two PERMANENTLY dark green grounds — the footer and the
// founding band on the home page — and those grounds do not change with the
// light/dusk theme. Every colour here therefore has to be chosen against the
// ground it actually sits on, not against the page theme.
//
// Getting that wrong hid the field completely. The input used to take the
// theme's own tokens (bg-surface, text-ink, border-hairline). In the light
// theme that is cream on dark green and looks fine; in dusk it resolves to
// #10201a on a #0f2e22 footer — the same dark green, with a 16%-opacity border
// — so the input was invisible and people pressed Subscribe on an empty form
// and got "That address does not look complete."
//
// Two more of the same bug were sitting next to it, both in the light theme
// where nobody had looked: --error is #a4432d, a dark red that disappears into
// the green, and --success is #2e5d3e, which IS very nearly the green. So the
// error line was barely legible and the success tick was invisible.
//
// Hence the literals below. --brand-ink / --brand-ink-muted are the project's
// theme-invariant ivory pair for dark grounds (see globals.css); the error and
// success values are the dusk variants, which are the ones built for dark
// backgrounds. The dark button already sets its gold this way.
export function NewsletterForm({
  context = "newsletter",
  buttonLabel = "Join the founding list",
  successTitle = "You are on the list.",
  successBody = "Watch for a letter from Dr. Laiyemo. The Garden opens soon.",
  tone = "light",
}: {
  context?: string;
  buttonLabel?: string;
  successTitle?: string;
  successBody?: string;
  tone?: "light" | "dark";
}) {
  const [result, formAction, isPending] = useActionState(joinFoundingList, null);

  // The ground this form sits on, which is what every colour below answers to.
  const dark = tone === "dark";

  // Analytics fire once per success, as an effect: calling track() in the
  // render body would re-fire on every parent re-render.
  useEffect(() => {
    if (result?.status === "ok") track("founding_list_signup", { context });
  }, [result, context]);

  if (result?.status === "ok") {
    return (
      <div className="animate-success-bloom flex items-start gap-3" role="status">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={`mt-1 h-5 w-5 ${dark ? "text-[#8fbf9a]" : "text-success"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 13c2.5 1.5 4 4 4.5 6C10 14 14 8.5 20 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className={`text-[15px] font-medium ${dark ? "text-brand-ink" : "text-ink"}`}>
            {successTitle}
          </p>
          <p className={`text-[14px] ${dark ? "text-brand-ink-muted/80" : "text-ink-muted"}`}>
            {/* Only promise a letter when one can actually be sent. */}
            {result.confirmationSent === false
              ? "Your address is safely on the list. Nothing else is needed from you."
              : successBody}
          </p>
        </div>
      </div>
    );
  }

  const invalid = result?.status === "invalid";
  const failed = result?.status === "failed";

  return (
    <form action={formAction} noValidate className="flex w-full max-w-md flex-col gap-2">
      <input type="hidden" name="context" value={context} />
      <label
        htmlFor={`email-${context}`}
        className={`text-[13px] font-medium ${dark ? "text-brand-ink-muted" : "text-ink-muted"}`}
      >
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`email-${context}`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `email-error-${context}` : undefined}
          className={`h-12 flex-1 rounded-xl border px-4 text-[15px] outline-none transition-shadow focus:ring-2 focus:ring-[var(--focus-ring)] ${
            dark
              ? "bg-brand-deep text-brand-ink placeholder:text-brand-ink-muted/70"
              : "bg-surface text-ink placeholder:text-ink-muted"
          } ${
            invalid
              ? dark
                ? "border-[#e58a6c]"
                : "border-error"
              : dark
                ? // 60%, not the 16% hairline used on light grounds. That hairline
                  // is a dark line on a pale field and reads fine; the same idea
                  // inverted onto dark green does not. Measured against the footer
                  // this gives 5.3:1 in dawn and 4.5:1 in dusk, clearing the 3:1
                  // WCAG 1.4.11 asks for on the boundary of a control. At 30% it
                  // was 2.2 and 1.8 — still effectively a hidden field.
                  "border-brand-ink/60"
                : "border-hairline"
          }`}
        />
        <button
          type="submit"
          disabled={isPending}
          className={`group inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-[15px] font-medium transition-transform duration-300 active:scale-[0.98] active:duration-75 disabled:opacity-60 motion-reduce:transition-none ${
            dark ? "bg-[#c9a227] text-[#0f2e22]" : "bg-btn text-btn-ink"
          }`}
        >
          {isPending ? "Planting..." : buttonLabel}
        </button>
      </div>
      {invalid && result.errors.email ? (
        <p
          id={`email-error-${context}`}
          className={`flex items-center gap-1.5 text-[13px] ${dark ? "text-[#e58a6c]" : "text-error"}`}
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
          </svg>
          {result.errors.email}
        </p>
      ) : null}
      {failed ? (
        <p className={`text-[13px] ${dark ? "text-[#e58a6c]" : "text-error"}`}>
          Something interrupted that. Please try once more.
        </p>
      ) : null}
    </form>
  );
}
