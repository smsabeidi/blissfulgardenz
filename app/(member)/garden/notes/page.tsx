import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { QuietButton } from "@/components/garden/buttons";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/db/types";
import { NotesClient } from "./notes-client";
import { isDemo, DEMO_NOTES } from "@/lib/demo";

// Notes: the quietest room in the Garden, and the one that keeps people coming
// back. Everything private is read here, on the server, with the member's own
// request-scoped client, so RLS answers "whose notes are these" rather than a
// WHERE clause somebody has to remember to write.

export const metadata: Metadata = {
  title: "Notes",
  // Never indexed, never followed. Middleware already redirects strangers, but
  // a private page should also say so out loud.
  robots: { index: false, follow: false },
};

const CONTEXT_TYPES = ["film", "guide", "general"] as const;
type ContextType = (typeof CONTEXT_TYPES)[number];

// ?context=film:the-quiet-season pre-scopes the new note to what the member was
// just watching or reading. Anything unrecognised falls back to a general note.
function parseContext(raw: string | string[] | undefined): {
  type: ContextType;
  ref: string | null;
} {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return { type: "general", ref: null };

  const separator = value.indexOf(":");
  if (separator < 1) return { type: "general", ref: null };

  const prefix = value.slice(0, separator);
  const ref = value.slice(separator + 1).trim();
  const type = CONTEXT_TYPES.find((candidate) => candidate === prefix);

  if (!type || type === "general" || ref.length === 0) return { type: "general", ref: null };
  return { type, ref: ref.slice(0, 160) };
}

// The member layout owns the chrome and the outer offset; a page owns its column.
function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16 lg:px-8">{children}</div>
  );
}

function Unavailable({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <Shell>
      <h1 className="text-display">{title}</h1>
      <p className="text-lede mt-4 max-w-[55ch]">{body}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </Shell>
  );
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ context?: string | string[] }>;
}) {
  const [{ context }, access] = await Promise.all([searchParams, getAccess()]);
  const scope = parseContext(context);

  if (!access.isMember || !access.userId) {
    return (
      <Unavailable
        title="Notes"
        body="Notes live inside The Inner Garden, and this account is not holding a seat right now. If you have joined and this looks wrong, write to us and we will put it right."
        action={<QuietButton href="/membership">See the membership</QuietButton>}
      />
    );
  }

  // Demo mode serves fixtures through the SAME render below, so what is shown is
  // the real page rather than a lookalike. Nothing here is persisted.
  if (isDemo()) {
    return <NotesView notes={DEMO_NOTES} scope={scope} />;
  }

  const supabase = await createClient();
  if (!supabase) {
    return (
      <Unavailable
        title="Notes"
        body="This part of the Garden is not open yet. Nothing has been lost. Please look again shortly."
      />
    );
  }

  // Ordered by updated_at because that is what the (user_id, updated_at desc)
  // index is built for, and because a note you touched this morning is the one
  // you are looking for. Bounded on purpose: an unbounded read is a slow page
  // waiting for its first prolific member.
  const { data, error } = await supabase
    .from("notes")
    .select("id, user_id, context_type, context_ref, body, created_at, updated_at, deleted_at")
    .eq("user_id", access.userId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <Unavailable
        title="Notes"
        body="Your notes could not be opened just now. They are safe. Please try again in a moment."
      />
    );
  }

  const notes = (data ?? []) as Note[];

  return <NotesView notes={notes} scope={scope} />;
}

// One render, two data sources. Keeps the demo honest: it is the real page.
function NotesView({
  notes,
  scope,
}: {
  notes: Note[];
  scope: { type: ContextType; ref: string | null };
}) {
  return (
    <Shell>
      <header className="flex flex-col gap-4">
        <h1 className="text-display">Notes</h1>
        <p className="text-body flex max-w-[58ch] items-start gap-2.5 text-ink-muted">
          <LockSimple aria-hidden weight="light" className="mt-1 h-[1.15em] w-[1.15em] shrink-0 text-sage" />
          <span>
            Private to you. Not visible to anyone else, including a second seat on your membership.
          </span>
        </p>
      </header>

      <div className="mt-10 sm:mt-12">
        <NotesClient notes={notes} contextType={scope.type} contextRef={scope.ref} />
      </div>
    </Shell>
  );
}
