import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Scoped to member routes ONLY. The marketing site must stay statically
// rendered and untouched: a matcher that swept every route would opt the whole
// site into dynamic rendering and quietly undo its performance work.
export const config = {
  matcher: ["/garden/:path*", "/account/:path*"],
};

export async function middleware(request: NextRequest) {
  // Demo mode: the gate stands open so the member area can be walked through
  // without an account. Single explicit switch, never inferred, never set in
  // production.
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Platform not configured: the gate stays shut and the public site is fine.
  if (!url || !key) {
    return NextResponse.redirect(new URL("/membership", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refreshes the session cookie as a side effect. Must run before the check.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signIn = new URL("/enter", request.url);
    signIn.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }

  return response;
}
