"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, platformReady } from "@/lib/env";

// Browser client, used only for the sign-in exchange and sign-out. Everything
// that reads member data does so on the server, so the anon key never fetches
// anything sensitive from the client.
export function createBrowserSupabase() {
  if (!platformReady()) return null;
  return createBrowserClient(env.supabaseUrl()!, env.supabaseAnonKey()!);
}
