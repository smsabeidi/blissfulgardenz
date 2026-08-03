"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { BloomButton } from "@/components/garden/buttons";
import {
  FieldError,
  FormError,
  fieldClasses,
  labelClasses,
  textActionClasses,
} from "@/components/garden/fields";
import { requestReset, type AuthResult } from "@/app/actions/auth";

export function ResetForm() {
  const [state, action, pending] = useActionState<AuthResult | null, FormData>(requestReset, null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.status === "invalid" && state.errors.email) emailRef.current?.focus();
  }, [state]);

  // The same answer whether or not there is a garden at that address — see the
  // note in requestReset. Saying "we have no account for that" would turn this
  // form into a way to find out who is a member.
  if (state?.status === "sent") {
    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        <h2 className="text-[17px] font-medium text-ink">Check your inbox</h2>
        <p className="text-[15px] leading-relaxed text-ink">
          If there is a garden at <span className="font-medium">{state.email}</span>, a link is on
          its way.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-muted">
          It is good for an hour and can be used once. Your current password keeps working until you
          choose a new one. If it has not arrived in a few minutes, look in the spam folder.
        </p>
        <div className="border-t border-hairline pt-3">
          <Link href="/enter" className={textActionClasses}>
            Back to signing in
          </Link>
        </div>
      </div>
    );
  }

  const error = state?.status === "invalid" ? state.errors.email : undefined;
  // See the note on AuthResult: React clears an uncontrolled form once the
  // action settles, so the address has to be handed back to survive an error.
  const typedEmail =
    state?.status === "invalid" || state?.status === "failed" ? (state.email ?? "") : "";

  return (
    <div className="flex flex-col gap-6">
      {state?.status === "failed" ? <FormError>{state.message}</FormError> : null}

      <form action={action} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="reset-email" className={labelClasses}>
            Email address
          </label>
          <input
            ref={emailRef}
            id="reset-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            defaultValue={typedEmail}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "reset-email-error" : undefined}
            className={fieldClasses(Boolean(error))}
          />
          {error ? <FieldError id="reset-email-error">{error}</FieldError> : null}
        </div>

        <BloomButton type="submit" disabled={pending} className="w-full">
          {pending ? "Sending the link..." : "Send me a link"}
        </BloomButton>
      </form>

      <div className="border-t border-hairline pt-3">
        <Link href="/enter" className={textActionClasses}>
          Back to signing in
        </Link>
      </div>
    </div>
  );
}
