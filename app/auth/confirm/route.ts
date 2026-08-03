import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { safeNext, RECOVERY_COOKIE, RECOVERY_COOKIE_MAX_AGE } from "@/lib/auth";

// Where every link we send by email lands: confirming a new address, resetting a
// forgotten password, agreeing to an email change.
//
// WHY token_hash AND NOT THE DEFAULT {{ .ConfirmationURL }}:
// The browser client signs in over PKCE, which leaves a code verifier in a
// cookie belonging to the browser that STARTED the flow. A link is not like an
// OAuth redirect — it gets forwarded, opened on a phone, clicked from a
// different machine — and in every one of those cases the verifier is somewhere
// else and the exchange fails for a reason nobody can act on. A token_hash is
// verified here, server-side, against the auth server, so the link works
// wherever it is opened. The templates in supabase/templates point here.
//
// The honest caveat: an emailed link can be consumed by a corporate link
// scanner before the person ever sees it, which is the exact failure the sign-in
// code was designed around. Passwords make links unavoidable, so the mitigation
// is elsewhere — short expiry, and a plainly worded way to ask for another.
//
// As with /auth/callback, nothing the auth server sends is reflected into a
// page. Failures leave with a short code that /enter turns into its own sentence.

const HANDLED: readonly EmailOtpType[] = [
  "signup",
  "recovery",
  "email_change",
  "email",
  "invite",
  "magiclink",
];

function isHandled(value: string | null): value is EmailOtpType {
  return value !== null && (HANDLED as readonly string[]).includes(value);
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const back = (path: string) => NextResponse.redirect(new URL(path, url.origin));

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  // Not a link of ours, or one mangled in transit.
  if (!tokenHash || !isHandled(type)) return back("/enter?error=missing");

  const supabase = await createClient();
  if (!supabase) return back("/enter?error=unavailable");

  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  // Used, expired, or already consumed by a scanner. The gate answers with a
  // fresh way in rather than a dead end.
  if (error) return back("/enter?error=exchange");

  const response = back(safeNext(url.searchParams.get("next")));

  // A recovery session belongs to someone who by definition cannot tell us their
  // current password, so setPassword needs to know this one arrived that way.
  // Server-set and HttpOnly: whether the current-password check is skipped is
  // not a decision the browser gets to make. Short-lived, spent on first use.
  //
  // The value is the user id, not a flag. A shared machine can hold more than
  // one session in fifteen minutes, and a bare "1" would let whoever signed in
  // next change a password without knowing the old one.
  if (type === "recovery" && data.user) {
    response.cookies.set(RECOVERY_COOKIE, data.user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: url.protocol === "https:",
      path: "/",
      maxAge: RECOVERY_COOKIE_MAX_AGE,
    });
  }

  return response;
}
