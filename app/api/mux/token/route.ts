import type { NextRequest } from "next/server";
import { z } from "zod";

import { getVideo } from "@/content/library";
import { getAccess } from "@/lib/access";
import { getPlaybackId, signPlaybackToken } from "@/lib/mux";
import { createClient } from "@/lib/supabase/server";

// The paywall, expressed once. A playback token is never embedded in a
// server-rendered page: the page renders for anyone the middleware lets
// through, and the token is minted here, after getAccess() confirms a live
// membership. That keeps the check in one auditable place and means a leaked
// page HTML is worth nothing.
//
// This route also carries film progress under ?action=progress. Two reasons it
// lives here rather than in a Server Action: file ownership keeps every
// endpoint this feature needs inside a single owned file, and more importantly
// a Server Action cannot be sent with navigator.sendBeacon. Saving a member's
// place when they close the tab is exactly the moment a normal request gets
// cancelled, so the endpoint has to be beaconable.

// node:crypto signing is unavailable on the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tokenSchema = z.object({
  slug: z.string().min(1).max(160),
});

const progressSchema = z.object({
  slug: z.string().min(1).max(160),
  // 24 hours is far past any plausible film length and keeps a hostile client
  // from writing nonsense into a member's own row.
  seconds: z.number().int().min(0).max(86_400),
  completed: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const access = await getAccess();
  if (!access.isMember || !access.userId) {
    return json({ error: "not_a_member" }, 403);
  }

  const body: unknown = await request.json().catch(() => null);

  return request.nextUrl.searchParams.get("action") === "progress"
    ? saveProgress(body, access.userId)
    : mintToken(body);
}

async function mintToken(body: unknown) {
  const parsed = tokenSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  const video = getVideo(parsed.data.slug);
  if (!video) return json({ error: "not_found" }, 404);

  const playbackId = getPlaybackId(video.slug);
  // A film with no asset yet is a 404 with a reason, not an error. The player
  // reads any 404 as "arriving soon" and shows the dignified panel.
  if (!playbackId) return json({ error: "arriving_soon" }, 404);

  // Null when signing keys are unset: development plays a public asset, and
  // production simply refuses the stream. Either way the page still renders.
  const token = signPlaybackToken(playbackId);

  return json({ playbackId, token }, 200);
}

async function saveProgress(body: unknown, userId: string) {
  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_request" }, 400);

  const video = getVideo(parsed.data.slug);
  if (!video) return json({ error: "not_found" }, 404);

  const supabase = await createClient();
  if (!supabase) return json({ error: "unavailable" }, 503);

  const payload: {
    user_id: string;
    video_slug: string;
    seconds: number;
    updated_at: string;
    completed?: boolean;
  } = {
    user_id: userId,
    video_slug: video.slug,
    seconds: parsed.data.seconds,
    updated_at: new Date().toISOString(),
  };

  // `completed` is only ever written true. Omitting the column leaves the
  // existing value untouched on conflict, so rewatching a film from the start
  // moves the resume point back without un-finishing it.
  if (parsed.data.completed) payload.completed = true;

  const { error } = await supabase
    .from("video_progress")
    .upsert(payload, { onConflict: "user_id,video_slug" });

  if (error) return json({ error: "not_saved" }, 500);

  return new Response(null, {
    status: 204,
    headers: { "cache-control": "no-store" },
  });
}

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, {
    status,
    // Tokens are short lived and member scoped. Nothing in this route may sit
    // in a shared cache or a browser's back/forward store.
    headers: { "cache-control": "no-store" },
  });
}
