"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useId,
  useOptimistic,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { BookOpen, FilmSlate, PencilSimple, TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/components/garden/primitives";
import { createNote, softDeleteNote, updateNote, type NoteResult } from "@/app/actions/notes";
import type { Note } from "@/lib/db/types";

// The writing surface. Three decisions shape it.
//
//   1. The composer holds exactly one note at a time. Blurring saves it, so a
//      half-written thought survives a phone call, and the note stays in the box
//      rather than jumping into the list mid-sentence. Save finishes it and the
//      note joins the list below.
//   2. Every mutation is optimistic, because a member deleting something they
//      regret writing should see it leave immediately, not after a round trip.
//   3. Motion is limited to colour transitions. The marketing site is cinematic;
//      this page is still on purpose. Some people arrive here on a hard day.

// Mirrors the zod schema in app/actions/notes.ts. A "use server" module can only
// export async functions, so the number is stated twice rather than imported.
const BODY_MAX = 10_000;

type ContextType = "film" | "guide" | "general";

type OptimisticAction =
  | { type: "add"; note: Note }
  | { type: "update"; id: string; body: string; at: string }
  | { type: "remove"; id: string };

function reduceNotes(current: Note[], action: OptimisticAction): Note[] {
  switch (action.type) {
    case "add":
      return [action.note, ...current];
    case "update":
      return current.map((note) =>
        note.id === action.id ? { ...note, body: action.body, updated_at: action.at } : note
      );
    case "remove":
      return current.filter((note) => note.id !== action.id);
  }
}

// UTC on purpose: the server and the first client render must agree exactly, or
// the date hydrates into a mismatch. Local relative time takes over after mount.
const absoluteDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatAbsolute(iso: string): string {
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? "" : absoluteDate.format(new Date(time));
}

function formatWhen(iso: string, now: number | null): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  if (now === null) return absoluteDate.format(new Date(time));

  const elapsed = now - time;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsed < minute) return "Just now";
  if (elapsed < hour) {
    const minutes = Math.max(1, Math.round(elapsed / minute));
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (elapsed < day) {
    const hours = Math.max(1, Math.round(elapsed / hour));
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  if (elapsed < 2 * day) return "Yesterday";
  if (elapsed < 7 * day) return `${Math.round(elapsed / day)} days ago`;
  return absoluteDate.format(new Date(time));
}

function humanizeSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const fieldClasses =
  "w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-[var(--focus-ring)]";

// Minimum 44px targets throughout: the audience runs from 24 to 70 and up, and
// most of them are holding a phone.
const quietAction =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline px-4 text-[15px] text-ink transition-colors duration-200 hover:bg-raised motion-reduce:transition-none";

const primaryAction =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-btn px-6 text-[15px] font-medium text-btn-ink transition-opacity duration-200 disabled:opacity-50 motion-reduce:transition-none";

function ContextTag({ type, refValue }: { type: ContextType; refValue: string | null }) {
  if (type === "general" || !refValue) return null;
  const Icon = type === "film" ? FilmSlate : BookOpen;

  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
      <Icon aria-hidden weight="light" className="h-4 w-4 text-sage" />
      <span className="sr-only">{type === "film" ? "Kept with the film" : "Kept with the guide"}: </span>
      {humanizeSlug(refValue)}
    </span>
  );
}

function ErrorLine({ id, children }: { id?: string; children: string }) {
  return (
    <p id={id} className="text-[13px] text-error">
      {children}
    </p>
  );
}

export function NotesClient({
  notes,
  contextType,
  contextRef,
}: {
  notes: Note[];
  contextType: ContextType;
  contextRef: string | null;
}) {
  const [items, applyOptimistic] = useOptimistic(notes, reduceNotes);
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  // The note the composer is currently holding. It exists in the database after
  // the first autosave, and stays hidden from the list until it is finished, so
  // the same words are never on screen twice.
  const [draftId, setDraftId] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const savedBodyRef = useRef("");
  // Safari does not focus a button on click, so relatedTarget alone cannot tell
  // "tabbed away" from "reached for Save". Without this the blur would autosave
  // and the click would then save again, leaving two notes.
  const reachingForActionRef = useRef(false);

  const composerId = useId();

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const [state, submit, pending] = useActionState<NoteResult | null, FormData>(
    async (_previous, formData) => {
      const committed = formData.get("intent") === "commit";
      const text = String(formData.get("body") ?? "").trim();
      const id = String(formData.get("noteId") ?? "");

      // Only a finished note joins the list, so that is the only save worth
      // showing ahead of the server.
      if (committed && !id) {
        applyOptimistic({
          type: "add",
          note: {
            id: `pending-${Date.now()}`,
            // Display only. The row is replaced by the real one a moment later.
            user_id: "",
            context_type: contextType,
            context_ref: contextRef,
            body: text,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          },
        });
      }

      const result = id ? await updateNote(null, formData) : await createNote(null, formData);

      if (result.status === "ok") {
        if (committed) {
          setBody("");
          setDraftId(null);
          savedBodyRef.current = "";
          setNotice("Saved to your notes.");
        } else {
          savedBodyRef.current = text;
          if (result.note) setDraftId(result.note.id);
          setNotice("Saved.");
        }
      } else {
        setNotice(null);
      }

      return result;
    },
    null
  );

  function handleBlur(event: FocusEvent<HTMLTextAreaElement>) {
    if (reachingForActionRef.current) {
      reachingForActionRef.current = false;
      return;
    }
    const next = event.relatedTarget;
    if (next instanceof HTMLElement && next.closest("[data-composer-actions]")) return;

    const text = body.trim();
    if (pending || text.length === 0 || text === savedBodyRef.current) return;
    formRef.current?.requestSubmit();
  }

  const errors = state?.status === "invalid" ? state.errors : {};
  const failed = state?.status === "failed";
  const remaining = BODY_MAX - body.length;
  const visible = items.filter((note) => note.id !== draftId);
  const scoped = contextType !== "general" && contextRef !== null;

  return (
    <div className="flex flex-col gap-14">
      <section aria-labelledby={`${composerId}-label`}>
        <form ref={formRef} action={submit} className="flex flex-col gap-3">
          <input type="hidden" name="noteId" value={draftId ?? ""} />
          <input type="hidden" name="contextType" value={contextType} />
          <input type="hidden" name="contextRef" value={contextRef ?? ""} />

          <label id={`${composerId}-label`} htmlFor={composerId} className="text-[15px] font-medium text-ink">
            A new note
          </label>

          {scoped && contextRef ? (
            <p className="text-[14px] text-ink-muted">
              This note will be kept with {humanizeSlug(contextRef)}.{" "}
              <Link href="/garden/notes" className="text-gold-text underline underline-offset-4">
                Write a general note instead
              </Link>
            </p>
          ) : null}

          <textarea
            id={composerId}
            name="body"
            rows={8}
            maxLength={BODY_MAX}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onBlur={handleBlur}
            aria-invalid={errors.body ? true : undefined}
            aria-describedby={`${composerId}-help${errors.body ? ` ${composerId}-error` : ""}`}
            className={`text-longform min-h-56 resize-y ${fieldClasses} ${errors.body ? "border-error" : ""}`}
          />

          <p id={`${composerId}-help`} className="text-[14px] text-ink-muted">
            This saves on its own when you step away. Press Save when the note is finished.
          </p>

          {errors.body ? <ErrorLine id={`${composerId}-error`}>{errors.body}</ErrorLine> : null}
          {errors.note ? <ErrorLine>{errors.note}</ErrorLine> : null}
          {failed ? <ErrorLine>Something interrupted that. Your words are still here. Please try once more.</ErrorLine> : null}

          {remaining <= 500 ? (
            <p className="text-[13px] text-ink-muted">
              {remaining > 0
                ? `${remaining.toLocaleString("en-US")} characters left in this note.`
                : "This note is full. Save it here, and start a second one for the rest."}
            </p>
          ) : null}

          <div
            data-composer-actions
            onPointerDown={() => {
              reachingForActionRef.current = true;
            }}
            className="mt-1 flex flex-wrap items-center gap-4"
          >
            <button
              type="submit"
              name="intent"
              value="commit"
              disabled={pending || body.trim().length === 0}
              className={primaryAction}
            >
              {pending ? "Saving" : "Save"}
            </button>
            <p role="status" className="text-[14px] text-ink-muted">
              {pending ? "Saving" : (notice ?? "")}
            </p>
          </div>
        </form>
      </section>

      <section aria-labelledby={`${composerId}-earlier`} className="flex flex-col gap-6">
        <h2 id={`${composerId}-earlier`} className="text-meta text-ink-muted">
          Earlier notes
        </h2>

        {visible.length === 0 ? (
          <EmptyState
            title="Your notes will gather here."
            body="This page is yours alone. Write a line, or a page, whenever something is worth keeping."
            action={
              <p className="text-longform mt-2 max-w-md text-balance italic text-ink-muted">
                &ldquo;What has been sitting with you this week that you have not said out loud?&rdquo;
              </p>
            }
          />
        ) : (
          <ul className="flex flex-col">
            {visible.map((note) => (
              <NoteRow key={note.id} note={note} now={now} applyOptimistic={applyOptimistic} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function NoteRow({
  note,
  now,
  applyOptimistic,
}: {
  note: Note;
  now: number | null;
  applyOptimistic: (action: OptimisticAction) => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "confirm">("view");
  const editId = useId();
  const when = formatWhen(note.updated_at, now);
  const absolute = formatAbsolute(note.updated_at);
  const pendingRow = note.id.startsWith("pending-");

  const [editState, editAction, editPending] = useActionState<NoteResult | null, FormData>(
    async (_previous, formData) => {
      const text = String(formData.get("body") ?? "").trim();
      applyOptimistic({ type: "update", id: note.id, body: text, at: new Date().toISOString() });
      const result = await updateNote(null, formData);
      if (result.status === "ok") setMode("view");
      return result;
    },
    null
  );

  const [deleteState, deleteAction, deletePending] = useActionState<NoteResult | null, FormData>(
    async (_previous, formData) => {
      applyOptimistic({ type: "remove", id: note.id });
      return softDeleteNote(null, formData);
    },
    null
  );

  const editErrors = editState?.status === "invalid" ? editState.errors : {};

  return (
    <li className="border-t border-hairline py-7 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <time dateTime={note.updated_at} className="text-[14px] text-ink-muted">
          {when}
        </time>
        <ContextTag type={note.context_type} refValue={note.context_ref} />
      </div>

      {mode === "edit" ? (
        <form action={editAction} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="noteId" value={note.id} />
          <label htmlFor={editId} className="text-[15px] font-medium text-ink">
            Edit this note
          </label>
          <textarea
            id={editId}
            name="body"
            rows={7}
            maxLength={BODY_MAX}
            defaultValue={note.body}
            aria-invalid={editErrors.body ? true : undefined}
            aria-describedby={editErrors.body ? `${editId}-error` : undefined}
            className={`text-longform min-h-48 resize-y ${fieldClasses} ${editErrors.body ? "border-error" : ""}`}
          />
          {editErrors.body ? <ErrorLine id={`${editId}-error`}>{editErrors.body}</ErrorLine> : null}
          {editErrors.note ? <ErrorLine>{editErrors.note}</ErrorLine> : null}
          {editState?.status === "failed" ? (
            <ErrorLine>That did not go through. Please try once more.</ErrorLine>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={editPending} className={primaryAction}>
              {editPending ? "Saving" : "Save changes"}
            </button>
            <button type="button" onClick={() => setMode("view")} className={quietAction}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-longform mt-3 whitespace-pre-wrap break-words text-ink">{note.body}</p>
      )}

      {mode === "confirm" ? (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-hairline bg-raised p-4">
          <p className="text-[15px] text-ink">
            Delete this note? You will not be able to open it again.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <form action={deleteAction}>
              <input type="hidden" name="noteId" value={note.id} />
              <button
                type="submit"
                disabled={deletePending}
                className={`${quietAction} border-error/60 text-error disabled:opacity-50`}
              >
                {deletePending ? "Deleting" : "Delete"}
              </button>
            </form>
            <button type="button" onClick={() => setMode("view")} className={quietAction}>
              Keep it
            </button>
          </div>
          {deleteState?.status === "failed" ? (
            <ErrorLine>That did not go through. The note is still here.</ErrorLine>
          ) : null}
        </div>
      ) : null}

      {mode === "view" && !pendingRow ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setMode("edit")} className={quietAction}>
            <PencilSimple aria-hidden weight="light" className="h-4 w-4" />
            Edit
            <span className="sr-only"> the note from {absolute}</span>
          </button>
          <button type="button" onClick={() => setMode("confirm")} className={quietAction}>
            <TrashSimple aria-hidden weight="light" className="h-4 w-4" />
            Delete
            <span className="sr-only"> the note from {absolute}</span>
          </button>
        </div>
      ) : null}
    </li>
  );
}
