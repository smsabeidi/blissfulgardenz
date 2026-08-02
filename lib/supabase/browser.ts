"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client, used only for the sign-in exchange and sign-out. Everything
// that reads member data does so on the server, so the anon key never fetches
// anything sensitive from the client.
//
// THESE TWO READS MUST STAY STATIC LITERALS. Next.js replaces
// `process.env.NEXT_PUBLIC_FOO` with its value at build time by scanning for
// that exact expression. It cannot do the same for a dynamic lookup like
// `process.env[name]`, which is what lib/env.ts uses internally — so routing
// these through the env helper compiled to `undefined` in the browser while
// continuing to work on the server, where process.env is real.
//
// The result was a sign-in page that server-rendered the Google button
// correctly and then replaced it with "the gate is closed just now" the instant
// it hydrated. It read as a configuration problem and survived several rounds
// of curl, because curl only ever sees the pre-hydration HTML, which was right.
//
// lib/env.ts remains correct for server code. It is simply not usable from a
// client component for NEXT_PUBLIC values, and this is the only client
// component that ever needed one.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createBrowserSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
