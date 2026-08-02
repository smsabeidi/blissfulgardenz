"use client";

import { useActionState, useEffect, useState } from "react";
import { requestConversation } from "@/app/actions";
import { BloomButton } from "@/components/garden/buttons";
import { disclaimer } from "@/content/site";

// Ask for a conversation.
//
// This asks for logistics and nothing else: who you are, how to reply, which
// path, whether you are coming alone, and when you are free. There is no "tell
// us what is going on" box on purpose — that belongs in the conversation with
// Dr. Laiyemo, not in a database row, and the schema has nowhere to put it.
//
// The time zone is read from the browser and submitted in a hidden field, so
// "Tuesday evenings" means the same thing to both people without anyone having
// to think about it.

const PATHS = [
  { id: "premarital", label: "Before marriage" },
  { id: "marital", label: "Within marriage" },
  { id: "rebuilding", label: "Rebuilding" },
  { id: "unsure", label: "Not sure yet" },
] as const;

const ATTENDING = [
  { id: "together", label: "Together" },
  { id: "alone", label: "I am coming alone" },
] as const;

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-1.5 text-[13px] text-error">
      {children}
    </p>
  );
}

const labelClasses = "text-[13px] font-medium text-ink-muted";
const fieldBase =
  "w-full rounded-xl border bg-surface px-4 text-[15px] text-ink outline-none transition-shadow placeholder:text-ink-muted/70 focus:ring-2 focus:ring-[var(--focus-ring)]";

function Choice({
  name,
  options,
  value,
  onChange,
  legend,
}: {
  name: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  legend: string;
}) {
  return (
    <fieldset>
      <legend className={labelClasses}>{legend}</legend>
      <input type="hidden" name={name} value={value} />
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`min-h-11 rounded-full border px-5 text-[15px] transition-colors duration-200 motion-reduce:transition-none ${
              value === o.id
                ? "border-transparent bg-brand text-brand-ink"
                : "border-hairline text-ink hover:bg-raised"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ConversationRequestForm() {
  const [state, action, pending] = useActionState(requestConversation, null);
  const [path, setPath] = useState<string>("unsure");
  const [attending, setAttending] = useState<string>("alone");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
    } catch {
      setTimezone("");
    }
  }, []);

  const errors = state?.status === "invalid" ? state.errors : {};

  if (state?.status === "ok") {
    return (
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-hairline bg-raised px-7 py-8">
        <p className="text-display-sm">Thank you. That is with us.</p>
        <p className="text-body max-w-[52ch] text-ink-muted">
          Dr. Laiyemo will write to you at the address you gave to arrange a time. Nothing is
          charged until you have agreed on one.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="timezone" value={timezone} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="req-name" className={labelClasses}>
            Your name
          </label>
          <input
            id="req-name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "req-name-error" : undefined}
            className={`mt-2 h-12 ${fieldBase} ${errors.name ? "border-error" : "border-hairline"}`}
          />
          {errors.name ? <FieldError id="req-name-error">{errors.name}</FieldError> : null}
        </div>

        <div>
          <label htmlFor="req-email" className={labelClasses}>
            Email address
          </label>
          <input
            id="req-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "req-email-error" : undefined}
            className={`mt-2 h-12 ${fieldBase} ${errors.email ? "border-error" : "border-hairline"}`}
          />
          {errors.email ? <FieldError id="req-email-error">{errors.email}</FieldError> : null}
        </div>
      </div>

      <Choice
        name="path"
        legend="Which season are you in?"
        options={PATHS}
        value={path}
        onChange={setPath}
      />
      <Choice
        name="attending"
        legend="Coming together, or beginning alone?"
        options={ATTENDING}
        value={attending}
        onChange={setAttending}
      />

      <div>
        <label htmlFor="req-availability" className={labelClasses}>
          When are you usually free? <span className="font-normal">(optional)</span>
        </label>
        <textarea
          id="req-availability"
          name="availability"
          rows={3}
          maxLength={400}
          placeholder="Weekday evenings, or Saturday mornings."
          className={`mt-2 resize-y py-3 ${fieldBase} border-hairline`}
        />
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
          Times only. There is nothing to explain here; that is what the conversation is for.
        </p>
      </div>

      {state?.status === "failed" ? (
        <p role="alert" className="text-[14px] text-error">
          That did not send. Nothing was lost on your side, but please try once more, or write to
          us directly.
        </p>
      ) : null}

      <BloomButton type="submit" disabled={pending} className="self-start">
        {pending ? "Sending" : "Ask for a conversation"}
      </BloomButton>

      <p className="max-w-[58ch] text-[13px] leading-relaxed text-ink-muted">
        {disclaimer.short}
      </p>
    </form>
  );
}
