"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Desk actions.
//
// Every write goes through the STAFF MEMBER'S OWN client, never the service
// role. That is the whole security model: `requests_staff_update` decides
// whether the update lands, so a bug in this file cannot escalate anyone. The
// service role would have worked and would have moved authorisation out of the
// database and into whichever branch I remembered to write.

const STATUSES = ["new", "contacted", "scheduled", "closed"] as const;
export type RequestStatus = (typeof STATUSES)[number];

export type DeskResult = { ok: boolean; message?: string };

export async function updateRequest(_prev: DeskResult | null, formData: FormData): Promise<DeskResult> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const scheduledFor = String(formData.get("scheduled_for") ?? "").trim();
  const staffNote = String(formData.get("staff_note") ?? "").trim().slice(0, 1000);

  if (!id) return { ok: false, message: "Missing request." };
  if (!(STATUSES as readonly string[]).includes(status)) {
    return { ok: false, message: "That is not a status." };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, message: "The desk is not connected just now." };

  const patch: Record<string, unknown> = {
    status,
    staff_note: staffNote || null,
    // Stamped when the request leaves the queue, so old rows can be pruned on a
    // schedule instead of keeping names forever.
    handled_at: status === "closed" ? new Date().toISOString() : null,
  };

  if (scheduledFor) {
    const when = new Date(scheduledFor);
    if (Number.isNaN(when.getTime())) return { ok: false, message: "That date did not parse." };
    patch.scheduled_for = when.toISOString();
  } else {
    patch.scheduled_for = null;
  }

  const { error } = await supabase.from("conversation_requests").update(patch).eq("id", id);

  if (error) {
    console.error(`[desk] update failed: ${error.message}`);
    return { ok: false, message: "That did not save." };
  }

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
  return { ok: true, message: "Saved." };
}
