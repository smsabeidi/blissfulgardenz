"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { friendly, messageOf, RECOVERY_COOKIE } from "@/lib/auth";

// The password half of the gate.
//
// WHY THESE ARE SERVER ACTIONS WHEN GOOGLE IS NOT:
// OAuth has to start in the browser — the PKCE verifier is written to a cookie
// by the browser client and read back by /auth/callback, and that already works.
// A password is different. Handled here, it is read straight out of FormData and
// never enters React state, the form keeps working with JavaScript switched off,
// and the session cookies are written by the server rather than shipped to it.
//
// Every action returns the `status` union the rest of the app uses, and none of
// them calls redirect(). Navigation stays a client decision, the way the gate
// has always done it, so the form can hold its busy state through the move.

// `email` is echoed back on every arm that leaves the person still at the form.
//
// Not decoration: React resets an uncontrolled form once its action settles, so
// a rejected sign-in would otherwise clear the address the person just typed and
// ask them to type it again to see the same error. The forms feed this straight
// back in as defaultValue. The password is deliberately not echoed — it should
// clear, and it has no business making the round trip.
export type AuthResult =
  | { status: "ok" }
  /** The work now continues in an inbox. `email` says where, so the page can too. */
  | { status: "sent"; email: string }
  | { status: "invalid"; errors: Record<string, string>; email?: string }
  | { status: "failed"; message: string; email?: string };

type Issue = { readonly path: readonly PropertyKey[]; readonly message: string };

function fieldErrors(issues: readonly Issue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = typeof issue.path[0] === "string" ? issue.path[0] : "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

const UNAVAILABLE = "The gate is closed just now. Please try again shortly.";
const SIGNED_OUT = "Please sign in again, then try once more.";

const emailField = z
  .email("That address does not look complete. One more look?")
  .max(254, "That address is longer than an address can be.");

// Ten characters, no composition rules. Forced symbols push people toward one
// memorised pattern and a sticky note; length is the part that actually helps.
// The upper bound is not arbitrary either: bcrypt stops reading at 72 bytes, so
// a longer password would be silently truncated and the extra typing would buy
// nothing. Better to say so than to pretend.
const passwordField = z
  .string()
  .min(10, "Ten characters or more, and anything you like.")
  .max(72, "That is longer than we can safely store. Please keep it under 72 characters.");

const credentialsSchema = z.object({ email: emailField, password: passwordField });
const emailOnlySchema = z.object({ email: emailField });

function read(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

/** Addresses are stored and compared lowercase; people type them however they like. */
function readEmail(formData: FormData): string {
  return read(formData, "email").trim().toLowerCase();
}

// ── Signing in ───────────────────────────────────────────────────────────────

export async function signIn(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const email = readEmail(formData);
  // Not trimmed. A leading or trailing space is a legitimate character in a
  // password, and quietly removing one would lock out whoever chose it.
  const password = read(formData, "password");

  // The password is checked for presence only, never against the length rule.
  // A password set before the minimum changed is still that person's password,
  // and "your password is too short" on a sign-in form is both useless and a
  // small confession about what we store. Supabase is the judge of correctness.
  const parsed = emailOnlySchema.safeParse({ email });
  if (!parsed.success) {
    return { status: "invalid", errors: fieldErrors(parsed.error.issues), email };
  }
  if (!password) {
    return { status: "invalid", errors: { password: "Please enter your password." }, email };
  }

  const supabase = await createClient();
  if (!supabase) return { status: "failed", message: UNAVAILABLE, email };

  const fallback = "We could not sign you in just then. Please try once more.";
  try {
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password });
    if (error) {
      return { status: "failed", message: friendly(error.message, fallback), email };
    }
  } catch (err) {
    return { status: "failed", message: friendly(messageOf(err), fallback), email };
  }

  // No revalidatePath here on purpose. router.refresh() on the client picks up
  // the new session for the route being entered, and busting the whole layout
  // cache would throw away the statically rendered marketing site for the sake
  // of a page the person is leaving anyway.
  return { status: "ok" };
}

// ── Opening a new garden ─────────────────────────────────────────────────────

export async function signUp(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const email = readEmail(formData);
  const parsed = credentialsSchema.safeParse({ email, password: read(formData, "password") });
  if (!parsed.success) {
    return { status: "invalid", errors: fieldErrors(parsed.error.issues), email };
  }

  const supabase = await createClient();
  if (!supabase) return { status: "failed", message: UNAVAILABLE, email };

  const fallback = "We could not open a garden just then. Please try once more.";
  try {
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: `${env.siteUrl()}/auth/confirm` },
    });
    if (error) {
      return { status: "failed", message: friendly(error.message, fallback), email };
    }
  } catch (err) {
    return { status: "failed", message: friendly(messageOf(err), fallback), email };
  }

  // Note what is NOT checked here: whether the address was already taken.
  // Supabase answers that ambiguously on purpose, and so do we. Confirmation is
  // required (see supabase/config.toml), so nothing is usable until the person
  // holding the inbox says so — which is also what keeps the staff allowlist in
  // migration 0004 honest.
  return { status: "sent", email: parsed.data.email };
}

// ── Forgotten passwords ──────────────────────────────────────────────────────

export async function requestReset(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = readEmail(formData);
  const parsed = emailOnlySchema.safeParse({ email });
  if (!parsed.success) {
    return { status: "invalid", errors: fieldErrors(parsed.error.issues), email };
  }

  const supabase = await createClient();
  if (!supabase) return { status: "failed", message: UNAVAILABLE, email };

  try {
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${env.siteUrl()}/auth/confirm?next=%2Fenter%2Fnew-password`,
    });
  } catch (err) {
    return {
      status: "failed",
      message: friendly(messageOf(err), "We could not send that just then. Please try once more."),
      email,
    };
  }

  // Always the same answer, whether or not there is a garden at that address.
  // Anything else turns this form into a way to find out who is a member. The
  // one error we do surface is the rate limit, which is about this browser
  // rather than about whose address it is — and it is thrown, not returned, or
  // caught above.
  return { status: "sent", email: parsed.data.email };
}

// ── Setting and changing a password ──────────────────────────────────────────

/**
 * Used by both /enter/new-password and the security panel on /account, because
 * they are the same act arrived at from two directions.
 *
 * The current password is required whenever there is one to give. Two exceptions,
 * both of them checked on the server:
 *   - a session that came through a recovery link, which by definition belongs to
 *     someone who cannot supply it (see RECOVERY_COOKIE);
 *   - an account with no password at all yet, which is every Google member
 *     setting one for the first time.
 */
export async function setPassword(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const parsed = z
    .object({ password: passwordField })
    .safeParse({ password: read(formData, "password") });
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error.issues) };

  const supabase = await createClient();
  if (!supabase) return { status: "failed", message: UNAVAILABLE };

  // getUser, not getSession: this is the one that asks the auth server rather
  // than trusting a cookie the browser handed us.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "failed", message: SIGNED_OUT };

  const jar = await cookies();
  // The marker carries the id of the person the recovery link was for, so a
  // second session on the same machine cannot inherit the exemption.
  const viaRecovery = jar.get(RECOVERY_COOKIE)?.value === user.id;
  const hasPassword = (user.identities ?? []).some((i) => i.provider === "email");

  if (hasPassword && !viaRecovery) {
    const current = read(formData, "currentPassword");
    if (!current) {
      return {
        status: "invalid",
        errors: { currentPassword: "Please enter your current password." },
      };
    }
    // Verifying by signing in is deliberate: it asks the auth server rather than
    // comparing anything here, and it costs one round trip. The session that
    // comes back belongs to the same person, so nothing is lost by replacing it.
    const { error: checkError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: current,
    });
    if (checkError) {
      return {
        status: "invalid",
        errors: { currentPassword: "That is not the password we have. Please try again." },
      };
    }
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) {
      const message = friendly(
        error.message,
        "We could not change that just then. Please try once more."
      );
      // Length and sameness are things the person can fix in the field they are
      // standing in, so they belong beside it rather than at the foot of the form.
      if (/at least|weak|different|same/i.test(error.message)) {
        return { status: "invalid", errors: { password: message } };
      }
      return { status: "failed", message };
    }
  } catch (err) {
    return {
      status: "failed",
      message: friendly(messageOf(err), "We could not change that just then. Please try once more."),
    };
  }

  // Spent. A recovery link buys exactly one password change.
  if (viaRecovery) jar.delete(RECOVERY_COOKIE);

  revalidatePath("/account");
  return { status: "ok" };
}
