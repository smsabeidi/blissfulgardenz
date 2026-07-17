"use client";

import { useActionState } from "react";
import { joinFoundingList } from "@/app/actions";
import { track } from "@/lib/track";

// Seeds of Harmony / founding-list capture. One field, label above, inline
// error below, success blooms in place. Double-submit guarded by isPending.
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

  if (result?.status === "ok") {
    track("founding_list_signup", { context });
    return (
      <div className="animate-success-bloom flex items-start gap-3" role="status">
        <svg aria-hidden viewBox="0 0 24 24" className="mt-1 h-5 w-5 text-success" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 13c2.5 1.5 4 4 4.5 6C10 14 14 8.5 20 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className={`text-[15px] font-medium ${tone === "dark" ? "text-[#F3E9DE]" : "text-ink"}`}>{successTitle}</p>
          <p className={`text-[14px] ${tone === "dark" ? "text-white/60" : "text-ink-muted"}`}>{successBody}</p>
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
        className={`text-[13px] font-medium ${tone === "dark" ? "text-white/70" : "text-ink-muted"}`}
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
          className={`h-12 flex-1 rounded-xl border bg-surface px-4 text-[15px] text-ink outline-none transition-shadow placeholder:text-ink-muted/70 focus:ring-2 focus:ring-[var(--focus-ring)] ${
            invalid ? "border-error" : "border-hairline"
          }`}
        />
        <button
          type="submit"
          disabled={isPending}
          className={`group inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-[15px] font-medium transition-transform duration-300 active:scale-[0.98] disabled:opacity-60 motion-reduce:transition-none ${
            tone === "dark" ? "bg-[#E3B04B] text-[#251A1D]" : "bg-btn text-btn-ink"
          }`}
        >
          {isPending ? "Planting..." : buttonLabel}
        </button>
      </div>
      {invalid && result.errors.email ? (
        <p id={`email-error-${context}`} className="flex items-center gap-1.5 text-[13px] text-error">
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
          </svg>
          {result.errors.email}
        </p>
      ) : null}
      {failed ? (
        <p className="text-[13px] text-error">Something interrupted that. Please try once more.</p>
      ) : null}
    </form>
  );
}
