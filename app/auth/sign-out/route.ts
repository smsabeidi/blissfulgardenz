import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST only. A sign-out reachable by GET is a sign-out that any image tag or
// prefetch on the internet can perform on someone mid-sentence.

export async function POST(request: NextRequest) {
  const home = new URL("/", request.nextUrl.origin);

  // Cross-site forms can POST too. Browsers always send Origin on a cross-site
  // form submission, so a present-and-foreign Origin is the one case worth
  // refusing. A missing header is left alone rather than guessed at.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.nextUrl.host) {
        return new NextResponse(null, { status: 403 });
      }
    } catch {
      return new NextResponse(null, { status: 403 });
    }
  }

  const supabase = await createClient();
  // No client means no session to end, and the redirect home is still the
  // right answer.
  if (supabase) await supabase.auth.signOut();

  // 303, not the default 307: a 307 preserves the method, so the browser would
  // POST to "/" and collect a 405 instead of the home page.
  return NextResponse.redirect(home, { status: 303 });
}
