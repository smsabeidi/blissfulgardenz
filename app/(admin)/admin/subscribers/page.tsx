import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Subscribers" };

// Seeds of Harmony, the list.
//
// Read only. Unsubscribing is the subscriber's own act through their own link;
// a staff write path here would let a mis-click quietly resubscribe someone who
// asked to leave, which is the kind of thing that ends up in a spam complaint.

type Row = {
  email: string;
  source: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

function when(v: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default async function SubscribersPage() {
  const supabase = await createClient();
  if (!supabase) {
    return <p className="text-body text-ink-muted">The desk is not connected just now.</p>;
  }

  const { data, error } = await supabase
    .from("founding_list")
    .select("email, source, confirmed_at, unsubscribed_at, created_at")
    .is("unsubscribed_at", null)
    .order("created_at", { ascending: false })
    .limit(1000);

  const rows = (data ?? []) as Row[];
  const unconfirmed = rows.filter((r) => !r.confirmed_at).length;
  const mailto = rows.length
    ? `mailto:?bcc=${encodeURIComponent(rows.map((r) => r.email).join(","))}`
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display">Subscribers</h1>
          <p className="text-lede mt-3 max-w-[54ch]">
            {rows.length} on the list for Seeds of Harmony.
          </p>
        </div>
        {mailto ? (
          <a
            href={mailto}
            className="min-h-11 rounded-full border border-hairline px-5 py-2.5 text-[15px] text-ink hover:bg-raised"
          >
            Open in mail, everyone on BCC
          </a>
        ) : null}
      </div>

      {unconfirmed > 0 ? (
        <p className="rounded-[1.25rem] border border-gold/50 px-5 py-4 text-[15px] leading-relaxed text-ink-muted">
          {unconfirmed === rows.length ? "All" : unconfirmed} of these have not confirmed, because
          no email provider is configured yet, so no confirmation could be sent. They subscribed
          deliberately and they are on the list. Once email is connected, confirmations can go out
          and this note disappears.
        </p>
      ) : null}

      {error ? (
        <p className="text-body text-ink-muted">The list could not be opened.</p>
      ) : rows.length === 0 ? (
        <p className="text-body text-ink-muted">
          Nobody yet. Everyone who subscribes from the site appears here.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-[15px]">
            <thead>
              <tr className="border-b border-hairline text-left text-[13px] text-ink-muted">
                <th scope="col" className="py-3 pr-4 font-medium">Email</th>
                <th scope="col" className="py-3 pr-4 font-medium">Came from</th>
                <th scope="col" className="py-3 pr-4 font-medium">Confirmed</th>
                <th scope="col" className="py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} className="border-b border-hairline/60">
                  <td className="py-3 pr-4">
                    <a
                      href={`mailto:${r.email}`}
                      className="text-gold-text underline decoration-hairline underline-offset-4"
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="py-3 pr-4 capitalize text-ink-muted">{r.source ?? "—"}</td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {r.confirmed_at ? when(r.confirmed_at) : "not yet"}
                  </td>
                  <td className="py-3 text-ink-muted">{when(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
