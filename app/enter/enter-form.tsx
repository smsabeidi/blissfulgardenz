"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { BloomButton } from "@/components/garden/buttons";
import {
  FieldError,
  FormError,
  fieldClasses,
  labelClasses,
  textActionClasses,
} from "@/components/garden/fields";
import { signIn, signUp, type AuthResult } from "@/app/actions/auth";
import { friendly, messageOf, safeNext } from "@/lib/auth";

// The gate. Two ways in.
//
// Google runs in the browser: the PKCE verifier is written to a cookie here and
// read back by /auth/callback, so the flow has to start client-side. Email and
// password run as server actions instead — the password is read straight out of
// FormData and never enters React state, and the form still works if JavaScript
// does not.
//
// WHAT WAS HERE BEFORE, AND WHY IT IS GONE:
// A typed 6-digit code, chosen because a magic link is a single-use token
// sitting in an inbox and two common things consume it before the person does:
// corporate link scanners, which burn the token on delivery, and in-app mail
// browsers, which start the session in a webview nobody returns to. That
// reasoning still holds — it is why the confirmation and reset links in
// supabase/templates carry a token_hash verified server-side rather than a PKCE
// code that only works in the browser that asked for it. But the code path
// depended on a Supabase email template change that was never made, so it sat
// switched off for months while people with no Google account had no way in at
// all. A password has neither failure and needs no template.

const UNAVAILABLE = "The gate is closed just now. Please try again shortly.";

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

const providerButtonClasses =
  "inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-hairline bg-surface px-6 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-raised active:scale-[0.98] disabled:opacity-60 motion-reduce:transition-none";

type Mode = "signin" | "signup";

export function EnterForm({ next }: { next: string }) {
  const router = useRouter();
  // One client for the life of the component. Null when the platform has no
  // keys, which the page normally catches first. This is the second belt.
  const [supabase] = useState(() => createBrowserSupabase());

  const [mode, setMode] = useState<Mode>("signin");
  const [googleBusy, setGoogleBusy] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const [signInState, signInAction, signingIn] = useActionState<AuthResult | null, FormData>(
    signIn,
    null
  );
  const [signUpState, signUpAction, signingUp] = useActionState<AuthResult | null, FormData>(
    signUp,
    null
  );

  const state = mode === "signin" ? signInState : signUpState;
  const pending = signingIn || signingUp || googleBusy;

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Signing in is the only outcome that moves the page. replace, not push: the
  // gate should not sit one back-press behind someone who is now inside.
  useEffect(() => {
    if (signInState?.status === "ok") {
      router.replace(safeNext(next));
      router.refresh();
    }
  }, [signInState, next, router]);

  // Send focus to whatever went wrong, so the correction happens where the
  // person already is rather than after a hunt back up the form.
  useEffect(() => {
    if (state?.status !== "invalid") return;
    if (state.errors.email) emailRef.current?.focus();
    else if (state.errors.password) passwordRef.current?.focus();
  }, [state]);

  async function handleGoogle() {
    if (!supabase) {
      setOauthError(UNAVAILABLE);
      return;
    }
    setGoogleBusy(true);
    setOauthError(null);
    const fallback = "We could not reach Google just then. Please try once more.";
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setGoogleBusy(false);
        setOauthError(friendly(error.message, fallback));
        return;
      }
      // Success means the browser is already leaving for Google. Staying busy
      // keeps the buttons quiet through the handoff.
    } catch (err) {
      setGoogleBusy(false);
      setOauthError(friendly(messageOf(err), fallback));
    }
  }

  function switchTo(nextMode: Mode) {
    setMode(nextMode);
    setOauthError(null);
    // The state of the form you are leaving is not an answer to the form you are
    // arriving at, and useActionState has no reset. Remounting the fields by key
    // is what clears it; see the `key` on the <form> below.
  }

  if (!supabase) {
    return (
      <p className="text-body text-ink-muted">
        The gate is closed just now. Please try again shortly, or write to us and we will let you
        know the moment it opens.
      </p>
    );
  }

  // Signed up, and the rest of it happens in an inbox.
  if (signUpState?.status === "sent") {
    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        <h2 className="text-[17px] font-medium text-ink">Look in your inbox</h2>
        <p className="text-[15px] leading-relaxed text-ink">
          We sent a note to <span className="font-medium">{signUpState.email}</span>. Open it, and
          the gate is yours.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-muted">
          It can take a moment to arrive, and it sometimes lands in spam. The link is good for an
          hour.
        </p>
        <div className="border-t border-hairline pt-3">
          <button type="button" onClick={() => switchTo("signin")} className={textActionClasses}>
            Back to signing in
          </button>
        </div>
      </div>
    );
  }

  const errors = state?.status === "invalid" ? state.errors : {};
  const formMessage = oauthError ?? (state?.status === "failed" ? state.message : null);

  // React resets an uncontrolled form once its action settles, so without this
  // a rejected sign-in would wipe the address and ask the person to type it
  // again just to see the same message. The password is left to clear.
  const typedEmail =
    state?.status === "invalid" || state?.status === "failed" ? (state.email ?? "") : "";

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => void handleGoogle()}
        disabled={pending}
        className={providerButtonClasses}
      >
        <GoogleMark />
        {googleBusy ? "Taking you to Google..." : "Continue with Google"}
      </button>

      <div className="flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-hairline" />
        <span className="text-meta text-ink-muted">or</span>
        <span aria-hidden className="h-px flex-1 bg-hairline" />
      </div>

      {formMessage ? <FormError>{formMessage}</FormError> : null}

      <form
        // Remounts on every switch, which is how the fields and the previous
        // result are cleared. Cheaper and less error-prone than mirroring the
        // action state into local state so it can be reset.
        key={mode}
        action={mode === "signin" ? signInAction : signUpAction}
        noValidate
        className="flex flex-col gap-5"
      >
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
            placeholder="you@example.com"
            defaultValue={typedEmail}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "enter-email-error" : undefined}
            className={fieldClasses(Boolean(errors.email))}
          />
          {errors.email ? <FieldError id="enter-email-error">{errors.email}</FieldError> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="enter-password" className={labelClasses}>
            Password
          </label>
          <input
            ref={passwordRef}
            id="enter-password"
            name="password"
            type="password"
            // The browser is told which of the two this is, so a password
            // manager offers to fill on one and to save on the other.
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password
                ? "enter-password-error"
                : mode === "signup"
                  ? "enter-password-hint"
                  : undefined
            }
            className={fieldClasses(Boolean(errors.password))}
          />
          {errors.password ? (
            <FieldError id="enter-password-error">{errors.password}</FieldError>
          ) : mode === "signup" ? (
            <p id="enter-password-hint" className="text-[13px] leading-relaxed text-ink-muted">
              Ten characters or more. Length is what matters, so a phrase you will remember beats
              anything with symbols in it.
            </p>
          ) : null}
        </div>

        <BloomButton type="submit" disabled={pending} className="w-full">
          {mode === "signin"
            ? signingIn
              ? "Opening the gate..."
              : "Enter the garden"
            : signingUp
              ? "Opening your garden..."
              : "Create my garden"}
        </BloomButton>
      </form>

      <div className="flex flex-wrap items-center gap-x-5 border-t border-hairline pt-3">
        <button
          type="button"
          aria-disabled={pending}
          onClick={() => {
            if (pending) return;
            switchTo(mode === "signin" ? "signup" : "signin");
          }}
          className={textActionClasses}
        >
          {mode === "signin" ? "Create an account" : "I already have a garden"}
        </button>
        {mode === "signin" ? (
          <Link href="/enter/reset" className={textActionClasses}>
            Forgot your password?
          </Link>
        ) : null}
      </div>
    </div>
  );
}
