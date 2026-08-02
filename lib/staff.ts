import { cache } from "react";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

// Is this viewer staff?
//
// Read through the member's OWN request-scoped client, never the service role.
// That matters: it means the answer comes from the same session the row-level
// policies are evaluating against, so this cannot disagree with what the
// database will actually allow. A helper that said "yes" while Postgres said
// "no" would render an empty desk and look like a bug; one that said "no" while
// Postgres said "yes" would hide the desk from the person who owns it.
//
// The pages built on this treat it as presentation only. Every table behind the
// desk carries its own is_staff() policy, so authorisation is enforced in the
// database and this only decides which page to draw.
export const isStaff = cache(async (): Promise<boolean> => {
  const access = await getAccess();
  if (!access.signedIn || !access.userId) return false;

  const supabase = await createClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from("profiles")
    .select("platform_role")
    .eq("id", access.userId)
    .maybeSingle();

  return (data as { platform_role?: string } | null)?.platform_role === "staff";
});
