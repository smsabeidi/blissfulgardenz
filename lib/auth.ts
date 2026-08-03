// A few small things the gate needs in more than one place, and which must not
// be allowed to drift into three slightly different versions of themselves.

/**
 * Marks a session as having arrived through a password-recovery link.
 *
 * `setPassword` normally insists on the current password, which is the whole
 * point of it — an unattended browser should not be enough to change the lock.
 * Someone who has forgotten their password cannot satisfy that, so /auth/confirm
 * sets this cookie when it verifies a `recovery` token and the action accepts it
 * as proof instead, once, then clears it.
 *
 * It is a server-set HttpOnly cookie rather than a field on the form because a
 * form field is something the client chooses, and "skip the password check" is
 * not a decision the client gets to make. Its value is the id of the user the
 * link was issued for, so a different session on the same machine cannot
 * inherit the exemption; /auth/sign-out clears it as well, for the same reason.
 */
export const RECOVERY_COOKIE = "bg-recovery";
export const RECOVERY_COOKIE_MAX_AGE = 15 * 60;

/**
 * The only redirect target the gate will ever accept.
 *
 * An open redirect on a sign-in callback is a phishing primitive: an attacker
 * sends a real link to a real gate and collects whoever lands on the far side.
 * Only same-site paths survive.
 *
 * Used by /enter, /auth/callback, /auth/confirm, and the form itself. It is one
 * function rather than four copies, because four copies is how three of them
 * end up missing a case — which is what had happened. "//evil.example" was
 * caught, but two disguises were not:
 *
 *   /\evil.example    A backslash. The URL standard treats \ as / inside a
 *                     special scheme, so new URL("/\evil.example", origin)
 *                     resolves to https://evil.example/. It walked straight
 *                     through a check that only looked for a second slash.
 *   /\t/evil.example  Tabs, newlines, and carriage returns are STRIPPED by the
 *                     URL parser before parsing, so "/<tab>/evil.example"
 *                     becomes "//evil.example" after the guard has approved it.
 *
 * Hence: reject control characters outright, then require the first character
 * to be a slash and the second to be neither kind of slash.
 */
export function safeNext(value: string | string[] | null | undefined): string {
  if (typeof value !== "string") return "/garden";
  if (/[\u0000-\u001F\u007F]/.test(value)) return "/garden";
  if (value[0] !== "/") return "/garden";
  if (value[1] === "/" || value[1] === "\\") return "/garden";
  return value;
}

/**
 * Supabase speaks in developer sentences. The garden does not.
 *
 * Every failure the person can actually see passes through here, so nothing the
 * auth provider says is ever printed verbatim. That is partly tone and partly
 * caution: provider errors sometimes name internals, and one of them below
 * ("invalid login credentials") is deliberately not narrowed to "wrong password"
 * or "no such account", because saying which would turn the sign-in form into a
 * way to test whether an address has a garden.
 */
export function friendly(raw: string, fallback: string): string {
  const m = raw.toLowerCase();

  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "That email and password do not match. Please check both, or reset your password below.";
  }
  if (m.includes("email not confirmed")) {
    return "This address has not been confirmed yet. Look for our email, and check the spam folder.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "There is already a garden at that address. Try signing in, or reset the password.";
  }
  if (m.includes("weak password") || m.includes("password should be") || m.includes("at least")) {
    return "That password is a little short. Ten characters or more, and anything you like.";
  }
  if (m.includes("same password") || m.includes("should be different")) {
    return "That is the password you already have. Please choose a different one.";
  }
  if (m.includes("expired") || m.includes("invalid") || m.includes("not found")) {
    return "That link has already been used, or it has expired. Ask for a fresh one below.";
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

export function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : "";
}
