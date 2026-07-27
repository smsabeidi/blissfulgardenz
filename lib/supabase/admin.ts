import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Service-role client. SERVER ONLY, and only for the three jobs that legitimately
// bypass RLS: Stripe webhook provisioning, the nightly entitlement reconciler,
// and founding-list writes from an unauthenticated form.
//
// It is never used to read a member's private notes. That is not a policy, it is
// a review rule: any new call site here must justify itself.
export function createAdminClient() {
  const url = env.supabaseUrl();
  const key = env.supabaseServiceKey();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
