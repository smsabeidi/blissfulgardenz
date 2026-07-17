"use client";

import { useActionState, useState } from "react";
import { sendContactMessage } from "@/app/actions";
import { disclaimer } from "@/content/site";

// ContactForm (PRD §7.8 + design ruling D11). Labels above fields, errors
// below in --error with aria-describedby, success replaces the form with a
// bloom state. When the visitor is beginning a conversation, confidentiality
// microcopy sits directly above the submit button and the crisis line rests
// quietly below the form. Message content is never logged or echoed anywhere.

export const CONVERSATION_TOPIC = "Begin a conversation";

const TOPICS = [
  "General hello",
  CONVERSATION_TOPIC,
  "Membership question",
  "Gifting",
  "Speaking invitation",
] as const;

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-[13px] text-error">
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 shrink-0"
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

const labelClasses = "text-[13px] font-medium text-ink-muted";
const fieldClasses =
  "w-full rounded-xl border bg-surface px-4 text-[15px] text-ink outline-none transition-shadow placeholder:text-ink-muted/70 focus:ring-2 focus:ring-[var(--focus-ring)]";

export function ContactForm({ initialTopic = "General hello" }: { initialTopic?: string }) {
  const [result, formAction, isPending] = useActionState(sendContactMessage, null);
  const [topic, setTopic] = useState<string>(
    (TOPICS as readonly string[]).includes(initialTopic) ? initialTopic : "General hello"
  );

  if (result?.status === "ok") {
    return (
      <div className="animate-success-bloom flex flex-col items-center gap-4 py-14 text-center" role="status">
        <svg
          aria-hidden
          viewBox="0 0 48 48"
          className="h-12 w-12 text-success"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="24" cy="24" r="21" opacity="0.3" />
          <path d="M14 25c4 2.5 6.5 6 7.5 9C24 25 30 16.5 37 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-display-sm">Your note is planted.</p>
        <p className="text-body max-w-sm text-ink-muted">We will be in touch.</p>
      </div>
    );
  }

  const errors = result?.status === "invalid" ? result.errors : {};
  const failed = result?.status === "failed";
  const isConversation = topic === CONVERSATION_TOPIC;

  return (
    <div>
      <form action={formAction} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className={labelClasses}>
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={`h-12 ${fieldClasses} ${errors.name ? "border-error" : "border-hairline"}`}
          />
          {errors.name ? <FieldError id="contact-name-error">{errors.name}</FieldError> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className={labelClasses}>
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={`h-12 ${fieldClasses} ${errors.email ? "border-error" : "border-hairline"}`}
          />
          {errors.email ? <FieldError id="contact-email-error">{errors.email}</FieldError> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-topic" className={labelClasses}>
            What brings you by
          </label>
          <div className="relative">
            <select
              id="contact-topic"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`h-12 appearance-none border-hairline pr-10 ${fieldClasses}`}
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className={labelClasses}>
            Your message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={`min-h-40 resize-y py-3 ${fieldClasses} ${
              errors.message ? "border-error" : "border-hairline"
            }`}
          />
          {errors.message ? <FieldError id="contact-message-error">{errors.message}</FieldError> : null}
        </div>

        {isConversation ? (
          <p className="text-[14px] leading-relaxed text-ink-muted">
            Share only what you are comfortable sharing. What you write stays between you and
            Dr. Laiyemo.
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-12 items-center justify-center self-start whitespace-nowrap rounded-full bg-btn px-7 text-[15px] font-medium text-btn-ink transition-transform duration-300 active:scale-[0.98] disabled:opacity-60 motion-reduce:transition-none"
          >
            {isPending ? "Sending..." : "Send your note"}
          </button>
          {failed ? (
            <p className="text-[13px] text-error">Something interrupted that. Please try once more.</p>
          ) : null}
        </div>
      </form>

      {isConversation ? (
        <p className="mt-6 border-t border-hairline pt-5 text-[13px] leading-relaxed text-ink-muted">
          {disclaimer.crisis}
        </p>
      ) : null}
    </div>
  );
}
