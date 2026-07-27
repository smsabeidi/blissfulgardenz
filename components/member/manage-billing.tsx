"use client";

import { useState } from "react";
import { QuietButton } from "@/components/garden/buttons";

// Opens the Stripe billing portal. A POST rather than a link because the portal
// session is minted per click and expires; a stale bookmarked URL would drop
// someone on an error at the moment they were trying to fix their card.
export function ManageBillingButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <QuietButton
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError(null);
          try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            const data = (await res.json()) as { url?: string; error?: string };
            if (data.url) {
              window.location.href = data.url;
              return;
            }
            setError(data.error ?? "We could not open billing just now.");
          } catch {
            setError("We could not reach billing just now.");
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? "Opening" : "Manage billing"}
      </QuietButton>
      {error ? (
        <p role="alert" className="text-[13px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
