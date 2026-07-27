"use client";

import { useActionState, useState } from "react";
import { inviteSeat, resendSeatInvite, revokeSeat, leaveSeat, type SeatResult } from "@/app/actions/seat";
import { BloomButton, QuietButton } from "@/components/garden/buttons";

// The second seat.
//
// The copy here does more work than the code. This product serves people who are
// single, widowed, separated and divorced as well as couples, so the empty state
// must read as an open door and never as an unfilled slot. "Invite your partner"
// with a dotted outline where a person should be is, for a widow, a small cruelty
// on her account page. It is phrased as something available, not something missing.

type Seat = {
  id: string;
  role: "owner" | "partner";
  status: "invited" | "active" | "left" | "removed";
  invitedEmail: string | null;
  displayName: string | null;
  joinedAt: string | null;
};

export function SeatPanel({
  seats,
  isOwner,
  seatLimit,
}: {
  seats: Seat[];
  isOwner: boolean;
  seatLimit: number;
}) {
  const partner = seats.find((s) => s.role === "partner" && (s.status === "invited" || s.status === "active"));
  const full = seats.filter((s) => s.status === "active").length >= seatLimit;

  if (!isOwner) {
    return <PartnerView />;
  }
  if (!partner) {
    return full ? <p className="text-body text-ink-muted">This membership is full.</p> : <InviteView />;
  }
  return partner.status === "invited" ? (
    <InvitedView seat={partner} />
  ) : (
    <ActiveView seat={partner} />
  );
}

function Privacy() {
  return (
    <p className="text-[15px] text-ink-muted">
      A second seat shares the films, the vault, and the gatherings. It never shows what the other
      person has written. Notes are private to whoever wrote them, always.
    </p>
  );
}

function InviteView() {
  const [state, action, pending] = useActionState<SeatResult | null, FormData>(inviteSeat, null);

  if (state?.status === "ok") {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-body">{state.message}</p>
        {state.inviteUrl ? <CopyLink url={state.inviteUrl} /> : null}
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <p className="text-body text-ink-muted">
        Your membership includes a second seat, if there is someone you would like to share it with.
        There is no hurry, and no need to use it at all.
      </p>
      <div className="flex flex-col gap-2">
        <label htmlFor="seat-email" className="text-[13px] font-medium text-ink-muted">
          Their email address
        </label>
        <input
          id="seat-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 rounded-xl border border-hairline bg-surface px-4 text-[15px] text-ink outline-none transition-shadow placeholder:text-ink-muted focus:ring-2 focus:ring-[var(--focus-ring)]"
          placeholder="them@example.com"
        />
        {state?.status === "invalid" && state.errors.email ? (
          <p role="alert" className="text-[13px] text-error">
            {state.errors.email}
          </p>
        ) : null}
      </div>
      <div>
        <BloomButton type="submit" disabled={pending}>
          {pending ? "Saving the seat" : "Save them a seat"}
        </BloomButton>
      </div>
      {state?.status === "failed" ? (
        <p role="alert" className="text-[13px] text-error">
          {state.message}
        </p>
      ) : null}
      <Privacy />
    </form>
  );
}

function InvitedView({ seat }: { seat: Seat }) {
  const [resendState, resend, resending] = useActionState<SeatResult | null, FormData>(
    resendSeatInvite,
    null
  );
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body">
        A seat is waiting for <span className="font-medium">{seat.invitedEmail}</span>. It stays open
        for seven days.
      </p>
      {resendState?.status === "ok" && resendState.inviteUrl ? (
        <CopyLink url={resendState.inviteUrl} />
      ) : null}
      <div className="flex flex-wrap gap-3">
        <form action={resend}>
          <input type="hidden" name="seatId" value={seat.id} />
          <QuietButton type="submit" disabled={resending}>
            {resending ? "Sending" : "Send it again"}
          </QuietButton>
        </form>
        <RevokeForm seatId={seat.id} label="Cancel the invitation" />
      </div>
      <Privacy />
    </div>
  );
}

function ActiveView({ seat }: { seat: Seat }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body">
        <span className="font-medium">{seat.displayName ?? "Your second seat"}</span> joined
        {seat.joinedAt
          ? ` on ${new Date(seat.joinedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
          : ""}
        .
      </p>
      <Privacy />
      <RevokeForm seatId={seat.id} label="Remove this seat" />
    </div>
  );
}

function PartnerView() {
  const [state, action, pending] = useActionState<SeatResult | null, FormData>(leaveSeat, null);
  const [confirming, setConfirming] = useState(false);

  if (state?.status === "ok") {
    return <p className="text-body">{state.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-body text-ink-muted">
        You hold the second seat on this membership. Billing is managed by the person who opened it.
      </p>
      <Privacy />
      {confirming ? (
        <form action={action} className="flex flex-col gap-3 rounded-2xl border border-hairline p-5">
          <p className="text-[15px]">
            Leaving gives up access to the films and the vault. Everything you have written stays
            yours and stays private.
          </p>
          <input type="hidden" name="confirm" value="leave" />
          <div className="flex flex-wrap gap-3">
            <QuietButton type="submit" disabled={pending}>
              {pending ? "Leaving" : "Yes, leave this membership"}
            </QuietButton>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="min-h-11 text-[15px] text-ink-muted underline-offset-4 hover:underline"
            >
              Stay
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="w-fit min-h-11 text-[15px] text-ink-muted underline-offset-4 hover:underline"
        >
          Leave this membership
        </button>
      )}
    </div>
  );
}

function RevokeForm({ seatId, label }: { seatId: string; label: string }) {
  const [state, action, pending] = useActionState<SeatResult | null, FormData>(revokeSeat, null);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit min-h-11 text-[15px] text-ink-muted underline-offset-4 hover:underline"
      >
        {label}
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3 rounded-2xl border border-hairline p-5">
      <p className="text-[15px]">
        This ends their access to the films and the vault. Anything they have written stays theirs
        and stays private. Type <span className="font-medium">remove</span> to confirm.
      </p>
      <input type="hidden" name="seatId" value={seatId} />
      <label htmlFor={`confirm-${seatId}`} className="text-[13px] font-medium text-ink-muted">
        Confirmation
      </label>
      <input
        id={`confirm-${seatId}`}
        name="confirm"
        required
        autoComplete="off"
        className="h-12 max-w-xs rounded-xl border border-hairline bg-surface px-4 text-[15px] outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
      />
      {state?.status === "invalid" && state.errors.confirm ? (
        <p role="alert" className="text-[13px] text-error">
          {state.errors.confirm}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <QuietButton type="submit" disabled={pending}>
          {pending ? "Removing" : "Confirm"}
        </QuietButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="min-h-11 text-[15px] text-ink-muted underline-offset-4 hover:underline"
        >
          Keep the seat
        </button>
      </div>
    </form>
  );
}

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-hairline bg-surface p-4">
      <p className="text-[13px] text-ink-muted">
        We sent them an email. You can also pass this link along yourself.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <code className="max-w-full break-all text-[13px] text-ink">{url}</code>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(url).then(
              () => setCopied(true),
              () => setCopied(false)
            );
          }}
          className="min-h-11 rounded-full border border-hairline px-4 text-[14px] hover:bg-raised"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
