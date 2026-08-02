import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Members" };

// The roster. Who holds a seat, what state their billing is in, and when they
// joined. No notes, no watch history, no reading habits: running a membership
// does not require watching the members.

type Row = {
  user_id: string;
  tier: string;
  status: string;
  seat_role: string | null;
  valid_until: string | null;
  updated_at: string | null;
};

const TONE: Record<string, string> = {
  active: "text-sage",
  grace: "text-gold-text",
  none: "text-ink-muted",
  canceled: "text-ink-muted",
};

function when(v: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default async function MembersPage() {
  const supabase = await createClient();
  if (!supabase) {
    return <p className="text-body text-ink-muted">The desk is not connected just now.</p>;
  }

  const { data, error } = await supabase
    .from("entitlements")
    .select("user_id, tier, status, seat_role, valid_until, updated_at")
    .order("updated_at", { ascending: false })
    .limit(500);

  const rows = (data ?? []) as Row[];
  const holding = rows.filter((r) => r.status === "active" || r.status === "grace");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-display">Members</h1>
        <p className="text-lede mt-3 max-w-[52ch]">
          {holding.length} holding a seat, {rows.length} accounts in total.
        </p>
      </div>

      {error ? (
        <p className="text-body text-ink-muted">The roster could not be opened.</p>
      ) : rows.length === 0 ? (
        <p className="text-body text-ink-muted">
          No accounts yet. Everyone who signs in appears here.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-[15px]">
            <thead>
              <tr className="border-b border-hairline text-left text-[13px] text-ink-muted">
                <th scope="col" className="py-3 pr-4 font-medium">Account</th>
                <th scope="col" className="py-3 pr-4 font-medium">Tier</th>
                <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                <th scope="col" className="py-3 pr-4 font-medium">Seat</th>
                <th scope="col" className="py-3 font-medium">Renews</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.user_id} className="border-b border-hairline/60">
                  <td className="py-3 pr-4 font-mono text-[13px] text-ink-muted">
                    {r.user_id.slice(0, 8)}…
                  </td>
                  <td className="py-3 pr-4 capitalize">{r.tier}</td>
                  <td className={`py-3 pr-4 capitalize ${TONE[r.status] ?? ""}`}>{r.status}</td>
                  <td className="py-3 pr-4 capitalize text-ink-muted">{r.seat_role ?? "—"}</td>
                  <td className="py-3 text-ink-muted">{when(r.valid_until)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
