"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileResult } from "@/app/actions/seat";
import { BloomButton } from "@/components/garden/buttons";

// Your details. A short form on purpose: every field here is one more thing we
// are asking someone to hand over, and none of them make the product better.

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Europe/London",
  "Africa/Lagos",
  "UTC",
];

export function AccountClient({
  email,
  displayName,
  timezone,
  letters,
  product,
}: {
  email: string;
  displayName: string | null;
  timezone: string | null;
  letters: boolean;
  product: boolean;
}) {
  const [state, action, pending] = useActionState<ProfileResult | null, FormData>(
    updateProfile,
    null
  );

  return (
    <form action={action} className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="displayName" className="text-[13px] font-medium text-ink-muted">
          What we should call you
        </label>
        <input
          id="displayName"
          name="displayName"
          defaultValue={displayName ?? ""}
          autoComplete="name"
          className="h-12 rounded-xl border border-hairline bg-surface px-4 text-[15px] text-ink outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
        {state?.status === "invalid" && state.errors.displayName ? (
          <p role="alert" className="text-[13px] text-error">
            {state.errors.displayName}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-ink-muted">Your email</span>
        <p className="text-body">{email}</p>
        <p className="text-[13px] text-ink-muted">
          This is how you sign in. To change it, write to us and we will move it safely.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="timezone" className="text-[13px] font-medium text-ink-muted">
          Your time zone
        </label>
        <select
          id="timezone"
          name="timezone"
          defaultValue={timezone ?? "America/New_York"}
          className="h-12 rounded-xl border border-hairline bg-surface px-4 text-[15px] text-ink outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <p className="text-[13px] text-ink-muted">Used for conversation times and gatherings.</p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-[13px] font-medium text-ink-muted">What we may send you</legend>
        <label className="flex min-h-11 items-center gap-3 text-[15px]">
          <input
            type="checkbox"
            name="letters"
            defaultChecked={letters}
            className="h-5 w-5 rounded border-hairline accent-[var(--brand)]"
          />
          Seeds of Harmony, the monthly letter
        </label>
        <label className="flex min-h-11 items-center gap-3 text-[15px]">
          <input
            type="checkbox"
            name="product"
            defaultChecked={product}
            className="h-5 w-5 rounded border-hairline accent-[var(--brand)]"
          />
          Occasional notes about the garden itself
        </label>
        <p className="text-[13px] text-ink-muted">
          Anything to do with your membership or a booked conversation is always sent, whatever you
          choose here.
        </p>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <BloomButton type="submit" disabled={pending} arrow={false}>
          {pending ? "Saving" : "Save"}
        </BloomButton>
        {state?.status === "ok" ? (
          <span role="status" className="text-[15px] text-success">
            Saved.
          </span>
        ) : null}
        {state?.status === "failed" ? (
          <span role="alert" className="text-[15px] text-error">
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
