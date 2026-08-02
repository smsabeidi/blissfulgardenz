import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Overview" };

// The overview answers the three questions worth asking before coffee: who is
// waiting, who is paying, and whose payment is in trouble. Everything else is a
// click away rather than on this page.

async function counts() {
  const supabase = await createClient();
  if (!supabase) return null;

  // head:true asks Postgres for the count only, so none of these pull rows
  // across the wire to be thrown away.
  const q = (table: string) => supabase.from(table).select("id", { count: "exact", head: true });

  const [waiting, scheduled, members, grace] = await Promise.all([
    q("conversation_requests").eq("status", "new"),
    q("conversation_requests").eq("status", "scheduled"),
    supabase.from("entitlements").select("user_id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("entitlements").select("user_id", { count: "exact", head: true }).eq("status", "grace"),
  ]);

  return {
    waiting: waiting.count ?? 0,
    scheduled: scheduled.count ?? 0,
    members: members.count ?? 0,
    grace: grace.count ?? 0,
  };
}

function Tile({
  label,
  value,
  href,
  tone = "quiet",
}: {
  label: string;
  value: number;
  href: string;
  tone?: "quiet" | "attention";
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col gap-1 rounded-[1.5rem] border px-6 py-6 transition-colors duration-200 hover:bg-raised motion-reduce:transition-none ${
        tone === "attention" && value > 0 ? "border-gold" : "border-hairline"
      }`}
    >
      <span className="font-[family-name:var(--font-display)] text-[2.4rem] leading-none">
        {value}
      </span>
      <span className="text-[15px] text-ink-muted">{label}</span>
    </Link>
  );
}

export default async function DeskOverview() {
  const c = await counts();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-display">The desk</h1>
        <p className="text-lede mt-3 max-w-[52ch]">
          Sessions and the Inner Garden, in one place.
        </p>
      </div>

      {c ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile label="Waiting to hear" value={c.waiting} href="/admin/requests" tone="attention" />
          <Tile label="Scheduled" value={c.scheduled} href="/admin/requests" />
          <Tile label="Active members" value={c.members} href="/admin/members" />
          <Tile label="Payment in trouble" value={c.grace} href="/admin/members" tone="attention" />
        </div>
      ) : (
        <p className="text-body text-ink-muted">The desk is not connected just now.</p>
      )}

      <div className="rounded-[1.5rem] border border-hairline px-6 py-5">
        <p className="text-[15px] leading-relaxed text-ink-muted">
          Members&rsquo; private notes are not readable from this desk, by anyone, including you.
          That is enforced by the database rather than by this page, so it stays true whatever gets
          built here later.
        </p>
      </div>
    </div>
  );
}
