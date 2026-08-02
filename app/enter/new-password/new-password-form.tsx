"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BloomButton } from "@/components/garden/buttons";
import { FieldError, FormError, fieldClasses, labelClasses } from "@/components/garden/fields";
import { setPassword, type AuthResult } from "@/app/actions/auth";

// No "current password" field here, and that is not an oversight: the person
// arrived through a recovery link precisely because they cannot supply one. The
// action knows to skip that check from a server-set cookie written by
// /auth/confirm, not from anything this form sends.

export function NewPasswordForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<AuthResult | null, FormData>(setPassword, null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.status === "ok") {
      router.replace("/garden");
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    if (state?.status === "invalid") passwordRef.current?.focus();
  }, [state]);

  const error = state?.status === "invalid" ? state.errors.password : undefined;

  return (
    <div className="flex flex-col gap-6">
      {state?.status === "failed" ? <FormError>{state.message}</FormError> : null}

      <form action={action} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="new-password" className={labelClasses}>
            Your new password
          </label>
          <input
            ref={passwordRef}
            id="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "new-password-error" : "new-password-hint"}
            className={fieldClasses(Boolean(error))}
          />
          {error ? (
            <FieldError id="new-password-error">{error}</FieldError>
          ) : (
            <p id="new-password-hint" className="text-[13px] leading-relaxed text-ink-muted">
              Ten characters or more. Length is what matters, so a phrase you will remember beats
              anything with symbols in it.
            </p>
          )}
        </div>

        <BloomButton type="submit" disabled={pending} className="w-full">
          {pending || state?.status === "ok" ? "Saving..." : "Save and enter the garden"}
        </BloomButton>
      </form>
    </div>
  );
}
