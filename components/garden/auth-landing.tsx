"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { safeNext } from "@/lib/auth";

// Finishes a sign-in that landed on the wrong page.
//
// Supabase only honours a `redirect_to` that appears in its redirect allow
// list. That list once contained just the Site URL, so every sign-in — Google
// included — came back to https://www.blissfulgardenz.com/ instead of
// /auth/callback, carrying its credential in the query string or the fragment.
// The home page had nothing to receive that, so accounts were being created in
// auth.users while the person bounced back to the marketing site still signed
// out. Two real accounts exist that never once reached the garden.
//
// FIXED AT THE SOURCE: supabase/config.toml now lists /auth/callback and
// /auth/confirm on all three origins, so the fallback below should never fire
// in normal use. It is kept because the allow list is remote state that a
// dashboard edit can undo without touching this repo, and the cost of being
// wrong about that is silent, invisible sign-in failures.
//
// This catches both shapes wherever they land:
//   ?code=…                     PKCE, what Google sends
//   #access_token=…&refresh_token=…   implicit, what an admin-issued link sends
//
// A fragment never reaches the server, so this has to run in the browser. It is
// mounted in the root layout because we cannot predict which page the fallback
// drops someone on.
//
// COST: the Supabase client is imported dynamically and only when a credential
// is actually present in the URL, so the marketing pages do not carry the auth
// bundle for the sake of a case that almost never fires there.
//
// This is a safety net, not a replacement for the allow list. Adding
// https://www.blissfulgardenz.com/** in Supabase restores the direct route to
// /auth/callback, and this simply stops firing.
export function AuthLanding() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    // An emailed confirmation or reset link that landed here instead of at
    // /auth/confirm. Nothing to do in the browser: the token is verified
    // server-side, so hand the whole query string over and let the route do it.
    // A full navigation rather than router.push, because the destination sets
    // cookies on its redirect response.
    if (url.searchParams.get("token_hash")) {
      window.location.replace(`/auth/confirm${url.search}`);
      return;
    }

    const code = url.searchParams.get("code");
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");

    if (!code && !accessToken) return;

    let cancelled = false;

    void (async () => {
      const { createBrowserSupabase } = await import("@/lib/supabase/browser");
      const supabase = createBrowserSupabase();
      if (!supabase || cancelled) return;

      try {
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      } catch {
        // A used or expired credential is not worth a scene. Falling through
        // leaves them on the page they landed on, signed out, which is exactly
        // what they would have seen anyway.
        return;
      }

      if (cancelled) return;

      // Only ever a path on this site: a `next` arriving in a URL is attacker
      // controlled, and a sign-in that can be pointed at another host is a
      // phishing primitive. Same guard as the two callback routes, from one place.
      const next = safeNext(url.searchParams.get("next"));

      // Strip the credential out of the address bar before navigating, so it is
      // not left in history or handed to the next page as a referrer.
      window.history.replaceState({}, "", url.pathname);
      router.replace(next);
      router.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
