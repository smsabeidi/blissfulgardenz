"use client";

import { useActionState } from "react";
import { updateRequest } from "../actions";

// One request, editable in place.
//
// A plain form posting a server action, so it works before hydration and needs
// no client state of its own. The only interactive nicety is that saving is
// announced politely rather than silently, because "did that save?" is the
// question a desk like this gets asked most.

const PATH_LABEL: Record<string, string> = {
  premarital: "Before marriage",
  marital: "Within marriage",
  rebuilding: "Rebuilding",
  unsure: "Not sure yet",
};

const STATUSES = [
  { id: "new", label: "Waiting" },
  { id: "contacted", label: "Contacted" },
  { id: "scheduled", label: "Scheduled" },
  { id: "closed", label: "Closed" },
];

export type Request = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  path: string;
  attending: string;
  availability: string | null;
  timezone: string | null;
  status: string;
  scheduled_for: string | null;
  staff_note: string | null;
};

const field =
  "w-full rounded-xl border border-hairline bg-surface px-3 py-2 text-[15px] text-ink outline-none focus:ring-2 focus:ring-[var(--focus-ring)]";

/** datetime-local wants `YYYY-MM-DDTHH:mm` in local time, not an ISO string. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function RequestRow({ request: r }: { request: Request }) {
  const [state, action, pending] = useActionState(updateRequest, null);

  return (
    <li className="rounded-[1.5rem] border border-hairline bg-surface px-6 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-[family-name:var(--font-display)] text-[1.4rem]">{r.name}</p>
        <p className="text-[13px] text-ink-muted">
          asked {new Date(r.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
        </p>
      </div>

      <p className="mt-1 text-[15px]">
        <a
          href={`mailto:${r.email}?subject=${encodeURIComponent("Your harmony conversation")}`}
          className="text-gold-text underline decoration-hairline underline-offset-4"
        >
          {r.email}
        </a>
      </p>

      <p className="mt-2 text-[15px] text-ink-muted">
        {PATH_LABEL[r.path] ?? r.path} ·{" "}
        {r.attending === "together" ? "Coming together" : "Beginning alone"}
        {r.timezone ? ` · ${r.timezone}` : ""}
      </p>

      {r.availability ? (
        <p className="mt-3 border-t border-hairline pt-3 text-[15px] leading-relaxed">
          Free: {r.availability}
        </p>
      ) : null}

      <form action={action} className="mt-4 flex flex-col gap-3 border-t border-hairline pt-4">
        <input type="hidden" name="id" value={r.id} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-ink-muted">Status</span>
            <select name="status" defaultValue={r.status} className={field}>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-ink-muted">Agreed time</span>
            <input
              type="datetime-local"
              name="scheduled_for"
              defaultValue={toLocalInput(r.scheduled_for)}
              className={field}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-ink-muted">Your note (private)</span>
          <textarea
            name="staff_note"
            rows={2}
            maxLength={1000}
            defaultValue={r.staff_note ?? ""}
            className={`${field} resize-y`}
          />
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 rounded-full bg-brand px-6 text-[15px] font-medium text-brand-ink disabled:opacity-60"
          >
            {pending ? "Saving" : "Save"}
          </button>
          <p role="status" aria-live="polite" className="text-[14px] text-ink-muted">
            {state ? state.message : ""}
          </p>
        </div>
      </form>
    </li>
  );
}
