import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";

// Where Google sends people back. The browser client started a PKCE flow and
// left the code verifier in a cookie; this trades the returned code for a
// session and writes the auth cookies onto the redirect response.
//
// Written for OAuth generally rather than for Google specifically, so a second
// provider would need nothing here but a second button on /enter.
//
// Every exit from here is a redirect to a path on this origin. Nothing the
// provider sends is ever reflected into a page: failures leave with a short
// code that /enter turns into its own sentence. The same-site guard lives in
// lib/auth.ts now, shared with /enter and /auth/confirm, so there is one
// definition of "a path we will send someone to" rather than three.

export async function GET(request: NextRequest) {
  // nextUrl is the URL Next resolved for this request, so redirects land on the
  // host the person is actually browsing without trusting a forwarding header.
  const url = request.nextUrl;
  const back = (path: string) => NextResponse.redirect(new URL(path, url.origin));

  // A provider can decline before we ever see a code (consent refused, or the
  // OAuth app misconfigured at the provider's end).
  if (url.searchParams.get("error")) return back("/enter?error=oauth");

  // An emailed link that arrived here rather than at /auth/confirm — an older
  // template, or a redirect allow-list that has not caught up. Hand it over
  // intact rather than failing on it.
  if (url.searchParams.get("token_hash")) {
    const confirm = new URL("/auth/confirm", url.origin);
    confirm.search = url.search;
    return NextResponse.redirect(confirm);
  }

  const code = url.searchParams.get("code");
  if (!code) return back("/enter?error=missing");

  const supabase = await createClient();
  if (!supabase) return back("/enter?error=unavailable");

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  // A used or expired code lands here, which is exactly what a link scanner
  // leaves behind. The gate answers with a fresh way in rather than a dead end.
  if (error) return back("/enter?error=exchange");

  return back(safeNext(url.searchParams.get("next")));
}
