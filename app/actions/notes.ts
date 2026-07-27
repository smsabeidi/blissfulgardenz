"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/db/types";

// Notes are the most private surface in The Inner Garden. Four rules hold here.
//
//   1. Every action re-checks getAccess(). Rendering a form on a gated page is
//      not a security boundary: a Server Action is a POST endpoint that anyone
//      can reach without ever loading the page that shows the form.
//   2. Writes go through the request-scoped client, never the admin client, so
//      Postgres RLS (user_id = auth.uid()) is what actually enforces ownership.
//      Application logic drifts; the policy cannot be talked around. The extra
//      user_id filters below are belt and braces, not the seatbelt.
//   3. Nothing here logs, echoes, or forwards a note body. Not to the console,
//      not into an error string, not into analytics. The one thing a member is
//      promised about this table is that no one else reads it.
//   4. Failures return a value; they never throw at the member. A person who
//      just wrote something difficult should not meet a stack trace.

export type NoteResult =
  | { status: "ok"; note?: Note }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "failed" };

const BODY_MAX = 10_000;

// Selected explicitly rather than with *, so a column added later cannot start
// travelling to the client by accident.
const NOTE_COLUMNS = "id, user_id, context_type, context_ref, body, created_at, updated_at, deleted_at";

const bodySchema = z
  .string()
  .min(1, "There is nothing to save yet. Write a line first.")
  .max(
    BODY_MAX,
    "This note has reached its full length. Save what is here, and start a second note for the rest."
  );

const contextTypeSchema = z.enum(["film", "guide", "general"]);
const contextRefSchema = z.string().max(160).nullable();
const noteIdSchema = z.uuid();

const noteInputSchema = z.object({
  body: bodySchema,
  context_type: contextTypeSchema,
  context_ref: contextRefSchema,
});

type Issue = { path: PropertyKey[]; message: string };

function fieldErrors(issues: readonly Issue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = typeof issue.path[0] === "string" ? issue.path[0] : "note";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

// Context is set by our own links (?context=film:the-quiet-season), not typed by
// a member. A malformed value therefore falls back rather than rejecting: losing
// the tag is a shrug, losing the words is not.
function readContext(formData: FormData): { context_type: "film" | "guide" | "general"; context_ref: string | null } {
  const type = contextTypeSchema.safeParse(String(formData.get("contextType") ?? "general"));
  const rawRef = String(formData.get("contextRef") ?? "").trim();
  const ref = contextRefSchema.safeParse(rawRef.length > 0 ? rawRef : null);

  return {
    context_type: type.success ? type.data : "general",
    context_ref: ref.success ? ref.data : null,
  };
}

function readBody(formData: FormData): string {
  return String(formData.get("body") ?? "").trim();
}

/** Creates a note owned by the signed-in member. */
export async function createNote(
  _prev: NoteResult | null,
  formData: FormData
): Promise<NoteResult> {
  const access = await getAccess();
  if (!access.isMember || !access.userId) return { status: "failed" };

  const parsed = noteInputSchema.safeParse({
    body: readBody(formData),
    ...readContext(formData),
  });
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error.issues) };

  const supabase = await createClient();
  if (!supabase) return { status: "failed" };

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: access.userId,
      body: parsed.data.body,
      context_type: parsed.data.context_type,
      context_ref: parsed.data.context_ref,
    })
    .select(NOTE_COLUMNS)
    .single();

  if (error || !data) return { status: "failed" };

  revalidatePath("/garden/notes");
  // The row shape is fixed by NOTE_COLUMNS above; the client is untyped, so this
  // is the one place the shape is asserted rather than inferred.
  return { status: "ok", note: data as Note };
}

/** Replaces the body of a note the member already owns. Context is immutable. */
export async function updateNote(
  _prev: NoteResult | null,
  formData: FormData
): Promise<NoteResult> {
  const access = await getAccess();
  if (!access.isMember || !access.userId) return { status: "failed" };

  const id = noteIdSchema.safeParse(String(formData.get("noteId") ?? ""));
  if (!id.success) return { status: "invalid", errors: { note: "That note could not be found." } };

  const body = bodySchema.safeParse(readBody(formData));
  if (!body.success) {
    return {
      status: "invalid",
      errors: { body: body.error.issues[0]?.message ?? "That note could not be saved." },
    };
  }

  const supabase = await createClient();
  if (!supabase) return { status: "failed" };

  const { data, error } = await supabase
    .from("notes")
    .update({ body: body.data, updated_at: new Date().toISOString() })
    .eq("id", id.data)
    .eq("user_id", access.userId)
    .is("deleted_at", null)
    .select(NOTE_COLUMNS)
    .maybeSingle();

  if (error) return { status: "failed" };
  if (!data) return { status: "invalid", errors: { note: "That note is no longer here." } };

  revalidatePath("/garden/notes");
  return { status: "ok", note: data as Note };
}

/**
 * Marks a note deleted. Soft, so an accidental tap on a phone is recoverable by
 * the team for a short while, and quiet: nothing in the member's view survives.
 */
export async function softDeleteNote(
  _prev: NoteResult | null,
  formData: FormData
): Promise<NoteResult> {
  const access = await getAccess();
  if (!access.isMember || !access.userId) return { status: "failed" };

  const id = noteIdSchema.safeParse(String(formData.get("noteId") ?? ""));
  if (!id.success) return { status: "invalid", errors: { note: "That note could not be found." } };

  const supabase = await createClient();
  if (!supabase) return { status: "failed" };

  const { error } = await supabase
    .from("notes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id.data)
    .eq("user_id", access.userId)
    .is("deleted_at", null);

  if (error) return { status: "failed" };

  revalidatePath("/garden/notes");
  // Deliberately idempotent. A double tap on a slow phone means the note is
  // gone twice over, which is still gone, and should not read as an error.
  return { status: "ok" };
}
