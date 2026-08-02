import { createClient } from "@/lib/supabase/server";
import { RequestRow, type Request } from "./request-row";

export const metadata = { title: "Requests" };

// The queue. Open requests first, closed ones hidden — a desk that shows you
// finished work alongside live work stops being read after a fortnight.

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const { show } = await searchParams;
  const showClosed = show === "closed";

  const supabase = await createClient();
  if (!supabase) {
    return <p className="text-body text-ink-muted">The desk is not connected just now.</p>;
  }

  let query = supabase
    .from("conversation_requests")
    .select(
      "id, created_at, name, email, path, attending, availability, timezone, status, scheduled_for, staff_note"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  query = showClosed ? query.eq("status", "closed") : query.neq("status", "closed");

  const { data, error } = await query;
  const rows = (data ?? []) as Request[];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display">{showClosed ? "Closed requests" : "Requests"}</h1>
          <p className="text-lede mt-3 max-w-[52ch]">
            {showClosed
              ? "Finished, kept for reference."
              : "People waiting to hear from you. Reply from your own inbox; nothing here sends mail."}
          </p>
        </div>
        <a
          href={showClosed ? "/admin/requests" : "/admin/requests?show=closed"}
          className="min-h-11 text-[15px] text-gold-text underline decoration-hairline underline-offset-4"
        >
          {showClosed ? "Back to open" : "See closed"}
        </a>
      </div>

      {error ? (
        <p className="text-body text-ink-muted">
          The queue could not be opened. Nothing has been lost.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-body text-ink-muted">
          {showClosed ? "Nothing closed yet." : "No one is waiting. When someone asks for a conversation, they appear here."}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((r) => (
            <RequestRow key={r.id} request={r} />
          ))}
        </ul>
      )}
    </div>
  );
}
