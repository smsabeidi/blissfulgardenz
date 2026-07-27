import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Double opt-in confirmation. Always redirects somewhere calm: an error page for
// a mistyped link would punish the person for our plumbing.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email")?.toLowerCase();
  const home = env.siteUrl();

  if (!token || !email) {
    return NextResponse.redirect(`${home}/?confirm=invalid`);
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.redirect(`${home}/?confirm=failed`);

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const { data: row } = await admin
    .from("founding_list")
    .select("id, confirmed_at")
    .eq("email", email)
    .eq("confirm_token_hash", tokenHash)
    .maybeSingle();

  if (!row) return NextResponse.redirect(`${home}/?confirm=invalid`);

  // Already confirmed is a success, not an error: people click twice.
  if (row.confirmed_at) return NextResponse.redirect(`${home}/?confirm=1`);

  const { error } = await admin
    .from("founding_list")
    .update({ confirmed_at: new Date().toISOString(), confirm_token_hash: null })
    .eq("id", row.id);

  if (error) return NextResponse.redirect(`${home}/?confirm=failed`);
  return NextResponse.redirect(`${home}/?confirm=1`);
}
