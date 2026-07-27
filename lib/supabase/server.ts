import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, platformReady } from "@/lib/env";

// Request-scoped Supabase client for Server Components, Server Actions, and
// Route Handlers. Returns null when the platform is unconfigured so the public
// marketing site keeps rendering untouched on a bare deploy.
export async function createClient() {
  if (!platformReady()) return null;
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl()!, env.supabaseAnonKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}
