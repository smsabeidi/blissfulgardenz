"use client";

import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { BloomButton } from "@/components/garden/buttons";

// The gate. Two ways in, both of them passwordless.
//
// WHY A TYPED 6 DIGIT CODE AND NOT A MAGIC LINK:
// A magic link is a single-use token sitting in an inbox, and two very common
// things consume it before the person ever does. Corporate link scanners
// (Outlook Safe Links, Proofpoint, Mimecast) fetch every URL in a message the
// moment it lands, which burns the token and hands the person an "already
// used" error for a mail they have not even opened. And when the link does
// survive, tapping it inside an in-app mail browser starts the session in a
// webview the person cannot navigate out of, so they end up signed in
// somewhere they will never return to and signed out in the browser they
// actually use.
// A typed code has neither failure. Scanners cannot type it, and it is entered
// in the same browser that asked for it, so the session lands where the person
// already is. It also survives someone forwarding the mail to their phone.
//
// OPS NOTE: this depends on the Supabase magic link email template including
// {{ .Token }}. Without that, the mail arrives with only a link and there is
// nothing for anyone to type.

const RESEND_SECONDS = 30;

const emailSchema = z.email();

const UNAVAILABLE = "The gate is closed just now. Please try again shortly.";

/** Only ever navigate to a path on this site. Mirrors the guard on the server
 *  so a tampered query string cannot bounce someone off to another host. */
// Google is the only sign-in path until the Supabase email template is changed
// to emit {{ .Token }}. Shipping the code field before that would send people a
// magic link when the form is asking them for six digits, which reads as broken.
// Set NEXT_PUBLIC_AUTH_EMAIL_ENABLED=1 to turn the email path back on.
const EMAIL_SIGN_IN_ENABLED = process.env.NEXT_PUBLIC_AUTH_EMAIL_ENABLED === "1";

function safePath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/garden";
  return value;
}

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : "";
}

/** Supabase speaks in developer sentences. The garden does not. */
function friendly(raw: string, fallback: string): string {
  const m = raw.toLowerCase();
  if (m.includes("expired") || m.includes("invalid") || m.includes("not found")) {
    return "That code did not match, or it has already expired. Ask for a new one below.";
  }
  if (m.includes("security purposes") || m.includes("rate") || m.includes("too many")) {
    return "That is a few tries in a row. Please wait a minute, then try again.";
  }
  if (m.includes("signups not allowed") || m.includes("not authorized")) {
    return "We could not open a garden for that address. Please write to us and we will help.";
  }
  if (m.includes("fetch") || m.includes("network")) {
    return "The connection dropped before that finished. Please try once more.";
  }
  return fallback;
}

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.97-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-[13px] leading-relaxed text-error">
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

const labelClasses = "text-[13px] font-medium text-ink-muted";
const fieldBase =
  "w-full rounded-xl border bg-surface px-4 text-ink outline-none transition-shadow placeholder:text-ink-muted/70 focus:ring-2 focus:ring-[var(--focus-ring)]";

// Quiet text controls, sized to the 44px minimum target. They go soft rather
// than disabled while unavailable: disabling the control a keyboard visitor is
// standing on throws their focus to the top of the document.
const textActionClasses =
  "inline-flex min-h-11 items-center rounded-full px-1 text-[14px] font-medium text-gold-text underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current aria-disabled:cursor-default aria-disabled:text-ink-muted aria-disabled:no-underline motion-reduce:transition-none";

type Busy = "google" | "send" | "resend" | "verify" | null;

export function EnterForm({ next }: { next: string }) {
  const router = useRouter();
  // One client for the life of the component. Null when the platform has no
  // keys, which the page normally catches first. This is the second belt.
  const [supabase] = useState(() => createBrowserSupabase());

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // Each tick schedules the next one, so the dependency is honestly `cooldown`
  // and there is no stale-closure interval to reason about.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  // Moving focus is right here: the person asked for a code and the field they
  // need appeared in answer. The sent-to line sits above the input in the same
  // live region, so it is announced first.
  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  const pending = busy !== null;

  function fail(ref: RefObject<HTMLInputElement | null>, message: string) {
    setBusy(null);
    setError(message);
    ref.current?.focus();
  }

  async function handleGoogle() {
    if (!supabase) {
      setError(UNAVAILABLE);
      return;
    }
    setBusy("google");
    setError(null);
    setNotice(null);
    const fallback = "We could not reach Google just then. Please try once more.";
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (oauthError) {
        setBusy(null);
        setError(friendly(oauthError.message, fallback));
        return;
      }
      // Success means the browser is already leaving for Google. Staying busy
      // keeps the buttons quiet through the handoff.
    } catch (err) {
      setBusy(null);
      setError(friendly(messageOf(err), fallback));
    }
  }

  async function sendCode(address: string, mode: "send" | "resend") {
    if (!supabase) {
      setError(UNAVAILABLE);
      return;
    }
    setBusy(mode);
    setError(null);
    setNotice(null);
    const fallback = "We could not send that code. Please try once more.";
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: address,
        options: { shouldCreateUser: true },
      });
      if (otpError) {
        fail(mode === "send" ? emailRef : codeRef, friendly(otpError.message, fallback));
        return;
      }
      setBusy(null);
      setStep("code");
      setCooldown(RESEND_SECONDS);
      if (mode === "resend") {
        setCode("");
        setNotice("A new code is on its way.");
      }
    } catch (err) {
      fail(mode === "send" ? emailRef : codeRef, friendly(messageOf(err), fallback));
    }
  }

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!emailSchema.safeParse(address).success || address.length > 254) {
      fail(emailRef, "That address does not look complete. One more look?");
      return;
    }
    setEmail(address);
    void sendCode(address, "send");
  }

  async function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setError(UNAVAILABLE);
      return;
    }
    if (code.length !== 6) {
      fail(codeRef, "The code is six digits. Please enter all six.");
      return;
    }
    setBusy("verify");
    setError(null);
    setNotice(null);
    const fallback = "That code did not work. Please try once more.";
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (verifyError) {
        fail(codeRef, friendly(verifyError.message, fallback));
        return;
      }
      // replace, not push: the gate should not sit one back-press behind
      // someone who is now inside. Stays busy through the navigation.
      router.replace(safePath(next));
      router.refresh();
    } catch (err) {
      fail(codeRef, friendly(messageOf(err), fallback));
    }
  }

  function startOver() {
    setStep("email");
    setCode("");
    setError(null);
    setNotice(null);
    setCooldown(0);
  }

  if (!supabase) {
    return (
      <p className="text-body text-ink-muted">
        The gate is closed just now. Please try again shortly, or write to us and we will let you
        know the moment it opens.
      </p>
    );
  }

  if (step === "code") {
    const resendBlocked = pending || cooldown > 0;
    return (
      <div className="flex flex-col gap-6">
        <div role="status" aria-live="polite" className="flex flex-col gap-1">
          <p className="text-[15px] leading-relaxed text-ink">
            We sent a 6 digit code to <span className="font-medium">{email}</span>.
          </p>
          <p className="text-[14px] leading-relaxed text-ink-muted">
            It can take a moment to arrive. Look in the spam folder if it is not there.
          </p>
          {notice ? <p className="text-[14px] text-gold-text">{notice}</p> : null}
        </div>

        <form onSubmit={handleCodeSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="enter-code" className={labelClasses}>
              Your 6 digit code
            </label>
            <input
              ref={codeRef}
              id="enter-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              readOnly={pending}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (error) setError(null);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "enter-code-error" : undefined}
              className={`h-14 text-center text-[22px] tracking-[0.4em] [text-indent:0.4em] ${fieldBase} ${
                error ? "border-error" : "border-hairline"
              }`}
            />
            {error ? <FieldError id="enter-code-error">{error}</FieldError> : null}
          </div>

          <BloomButton type="submit" disabled={pending} className="w-full">
            {busy === "verify" ? "Opening the gate..." : "Enter the garden"}
          </BloomButton>
        </form>

        <div className="flex flex-wrap items-center gap-x-5 border-t border-hairline pt-3">
          <button
            type="button"
            aria-disabled={resendBlocked}
            onClick={() => {
              if (resendBlocked) return;
              void sendCode(email, "resend");
            }}
            className={textActionClasses}
          >
            {busy === "resend"
              ? "Sending..."
              : cooldown > 0
                ? `Send a new code in ${cooldown}s`
                : "Send a new code"}
          </button>
          <button
            type="button"
            aria-disabled={pending}
            onClick={() => {
              if (pending) return;
              startOver();
            }}
            className={textActionClasses}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => void handleGoogle()}
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-hairline bg-surface px-6 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-raised active:scale-[0.98] disabled:opacity-60 motion-reduce:transition-none"
      >
        <GoogleMark />
        {busy === "google" ? "Taking you to Google..." : "Continue with Google"}
      </button>

      {!EMAIL_SIGN_IN_ENABLED ? (
        <p className="text-[13px] leading-relaxed text-ink-muted">
          Signing in with Google keeps it to one tap, and there is no password to remember.
        </p>
      ) : null}

      {EMAIL_SIGN_IN_ENABLED ? (
        <>
      <div className="flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-hairline" />
        <span className="text-meta text-ink-muted">or</span>
        <span aria-hidden className="h-px flex-1 bg-hairline" />
      </div>

      <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="enter-email" className={labelClasses}>
            Email address
          </label>
          <input
            ref={emailRef}
            id="enter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            readOnly={pending}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="you@example.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "enter-email-error" : "enter-email-hint"}
            className={`h-12 text-[15px] ${fieldBase} ${error ? "border-error" : "border-hairline"}`}
          />
          {error ? (
            <FieldError id="enter-email-error">{error}</FieldError>
          ) : (
            <p id="enter-email-hint" className="text-[13px] leading-relaxed text-ink-muted">
              We will email you a 6 digit code. There is no password to remember.
            </p>
          )}
        </div>

        <BloomButton type="submit" disabled={pending} className="w-full">
          {busy === "send" ? "Sending your code..." : "Email me a code"}
        </BloomButton>
      </form>
        </>
      ) : null}
    </div>
  );
}
