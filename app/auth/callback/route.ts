import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where Google sends people back. The browser client started a PKCE flow and
// left the code verifier in a cookie; this trades the returned code for a
// session and writes the auth cookies onto the redirect response.
//
// Every exit from here is a redirect to a path on this origin. Nothing the
// provider sends is ever reflected into a page: failures leave with a short
// code that /enter turns into its own sentence.

/** An open redirect on a sign-in callback is a phishing primitive: an attacker
 *  sends a real link to a real gate and collects whoever lands on the far side.
 *  Only same-site paths survive. "//evil.example" is protocol-relative, so it
 *  is absolute in disguise and gets the same treatment as https://. */
function safeNext(value: string | null): string {
  if (!value) return "/garden";
  if (!value.startsWith("/") || value.startsWith("//")) return "/garden";
  return value;
}

export async function GET(request: NextRequest) {
  // nextUrl is the URL Next resolved for this request, so redirects land on the
  // host the person is actually browsing without trusting a forwarding header.
  const url = request.nextUrl;
  const back = (path: string) => NextResponse.redirect(new URL(path, url.origin));

  // Google can decline before we ever see a code (consent refused, app config).
  if (url.searchParams.get("error")) return back("/enter?error=oauth");

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
