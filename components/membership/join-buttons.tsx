"use client";

import { useState } from "react";
import { BloomButton } from "@/components/garden/buttons";

// Live checkout for the membership page.
//
// Deliberately feature-flagged by the caller on billingReady(): with no Stripe
// keys configured the page keeps its pre-launch founding-list posture, and the
// moment real keys exist the same page starts selling. That means launching is
// a configuration change rather than a deploy, and nobody has to remember to
// swap the copy back.

type Plan = "monthly" | "annual" | "founding";

export function JoinButtons({
  defaultPlan = "annual",
  signedIn,
}: {
  defaultPlan?: Plan;
  signedIn: boolean;
}) {
  const [plan, setPlan] = useState<Plan>(defaultPlan);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "We could not open checkout. Please try once more.");
    } catch {
      setError("We could not reach checkout. Please try once more.");
    } finally {
      setPending(false);
    }
  }

  // Someone must have an account before they can hold a membership, because the
  // membership attaches to a person and a seat, not to an email on a receipt.
  if (!signedIn) {
    return (
      <div className="flex flex-col gap-3">
        <BloomButton href="/enter?next=/membership">Create your account</BloomButton>
        <p className="text-[14px] text-ink-muted">
          One step first, so your membership has somewhere to live.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-meta text-gold-text">Choose how you pay</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              { id: "annual", label: "Yearly, two months free" },
              { id: "monthly", label: "Monthly" },
            ] as { id: Plan; label: string }[]
          ).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setPlan(o.id)}
              aria-pressed={plan === o.id}
              className={`min-h-11 rounded-full border px-5 text-[15px] transition-colors duration-200 ${
                plan === o.id
                  ? "border-transparent bg-brand text-brand-ink"
                  : "border-hairline text-ink hover:bg-raised"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      <BloomButton type="button" onClick={start} disabled={pending}>
        {pending ? "Opening checkout" : "Join the Inner Garden"}
      </BloomButton>

      {error ? (
        <p role="alert" className="text-[14px] text-error">
          {error}
        </p>
      ) : null}
      <p className="text-[13px] text-ink-muted">
        Payment is handled by Stripe. Your card details never touch our servers.
      </p>
    </div>
  );
}
