"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BloomButton } from "@/components/garden/buttons";
import {
  FieldError,
  FormError,
  fieldClasses,
  labelClasses,
  textActionClasses,
} from "@/components/garden/fields";
import { setPassword, type AuthResult } from "@/app/actions/auth";

// Sign-in and security.
//
// This section exists because without it the two halves of the gate cannot
// reach each other. Someone who joined with Google has no password and no way
// to acquire one, so they are tied to that account forever; someone who joined
// with a password can only change it by pretending to have forgotten it. Both
// are fixed here.
//
// The current-password field appears only when there is a password to give. Its
// absence is decided on the server too — the action re-derives it from the
// user's identities rather than trusting the shape of this form.

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  apple: "Apple",
  email: "A password",
};

export function SecurityClient({ providers, email }: { providers: string[]; email: string }) {
  const hasPassword = providers.includes("email");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<AuthResult | null, FormData>(setPassword, null);

  const currentRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.status !== "invalid") return;
    if (state.errors.currentPassword) currentRef.current?.focus();
    else if (state.errors.password) passwordRef.current?.focus();
  }, [state]);

  // Fold the form away once it has done its job, so the section settles back to
  // a statement of fact rather than sitting open with a stale success line.
  useEffect(() => {
    if (state?.status === "ok") setOpen(false);
  }, [state]);

  const linked = providers
    .map((p) => PROVIDER_LABELS[p])
    .filter(Boolean)
    .join(", ");

  const errors = state?.status === "invalid" ? state.errors : {};

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className={labelClasses}>How you sign in</span>
        <p className="text-body">{linked || "Not yet recorded"}</p>
        <p className="text-[13px] text-ink-muted">
          Any of these opens the same garden, as long as they share the address {email}. To change
          the address itself, write to us and we will move it safely.
        </p>
      </div>

      {state?.status === "ok" && !open ? (
        <p role="status" className="text-[15px] text-success">
          {hasPassword ? "Your password has been changed." : "Your password is set."}
        </p>
      ) : null}

      {!open ? (
        <div>
          <BloomButton type="button" arrow={false} onClick={() => setOpen(true)}>
            {hasPassword ? "Change password" : "Set a password"}
          </BloomButton>
          {!hasPassword ? (
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              Optional. It gives you a second way in if you ever lose access to {linked || "that account"}.
            </p>
          ) : null}
        </div>
      ) : (
        <form action={action} noValidate className="flex flex-col gap-5">
          {state?.status === "failed" ? <FormError>{state.message}</FormError> : null}

          {/* Off-screen but present, so password managers know which account the
              new password belongs to. Removing it makes them offer to save it
              against nothing in particular. */}
          <input type="hidden" name="username" autoComplete="username" value={email} readOnly />

          {hasPassword ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="security-current" className={labelClasses}>
                Your current password
              </label>
              <input
                ref={currentRef}
                id="security-current"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                aria-invalid={errors.currentPassword ? true : undefined}
                aria-describedby={errors.currentPassword ? "security-current-error" : undefined}
                className={fieldClasses(Boolean(errors.currentPassword))}
              />
              {errors.currentPassword ? (
                <FieldError id="security-current-error">{errors.currentPassword}</FieldError>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <label htmlFor="security-password" className={labelClasses}>
              {hasPassword ? "Your new password" : "Your password"}
            </label>
            <input
              ref={passwordRef}
              id="security-password"
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "security-password-error" : "security-password-hint"}
              className={fieldClasses(Boolean(errors.password))}
            />
            {errors.password ? (
              <FieldError id="security-password-error">{errors.password}</FieldError>
            ) : (
              <p id="security-password-hint" className="text-[13px] leading-relaxed text-ink-muted">
                Ten characters or more. Length is what matters, so a phrase you will remember beats
                anything with symbols in it.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <BloomButton type="submit" disabled={pending} arrow={false}>
              {pending ? "Saving" : hasPassword ? "Change it" : "Set it"}
            </BloomButton>
            <button
              type="button"
              aria-disabled={pending}
              onClick={() => {
                if (pending) return;
                setOpen(false);
              }}
              className={textActionClasses}
            >
              Never mind
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
