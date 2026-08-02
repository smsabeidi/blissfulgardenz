import type { Metadata } from "next";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { MemberSection } from "@/components/member/section";

// The requests desk. Staff only.
//
// Conversation requests are useless sitting in a table nobody opens, and email
// delivery is not configured, so this is where Dr. Laiyemo actually reads them.
//
// Authorisation is NOT enforced here. This page only decides what to render;
// the database decides what may be read. `requests_staff_read` restricts the
// table to profiles with platform_role = 'staff', so a member who guesses this
// URL gets an empty list from Postgres, not a list this page forgot to filter.
// The check below exists to show them an honest page, not to protect the data.

export const metadata: Metadata = {
  title: "Requests",
  robots: { index: false, follow: false },
};

const PATH_LABEL: Record<string, string> = {
  premarital: "Before marriage",
  marital: "Within marriage",
  rebuilding: "Rebuilding",
  unsure: "Not sure yet",
};

type Row = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  path: string;
  attending: string;
  availability: string | null;
  timezone: string | null;
  status: string;
};

export default async function RequestsPage() {
  const access = await getAccess();
  const supabase = await createClient();

  if (!access.signedIn || !supabase) {
    return (
      <MemberSection as="h1" title="Requests" lede="Please sign in." width="reading" />
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("platform_role")
    .eq("id", access.userId)
    .maybeSingle();

  if ((profile as { platform_role?: string } | null)?.platform_role !== "staff") {
    return (
      <MemberSection
        as="h1"
        title="Requests"
        lede="This desk belongs to the Blissful Gardenz team."
        width="reading"
      />
    );
  }

  const { data, error } = await supabase
    .from("conversation_requests")
    .select("id, created_at, name, email, path, attending, availability, timezone, status")
    .neq("status", "closed")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as Row[];

  return (
    <div className="pb-24">
      <MemberSection
        as="h1"
        title="Conversation requests"
        lede="People waiting to hear from you. Oldest at the bottom. Reply from your own inbox; nothing here sends mail."
        width="wide"
      />
      <MemberSection width="wide">
        {error ? (
          <p className="text-body text-ink-muted">
            The desk could not be opened just now. Nothing has been lost.
          </p>
        ) : rows.length === 0 ? (
          <p className="text-body text-ink-muted">
            No open requests. When someone asks for a conversation, they appear here.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {rows.map((r) => (
              <li
                key={r.id}
                className="rounded-[1.5rem] border border-hairline bg-surface px-6 py-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <p className="text-display-sm">{r.name}</p>
                  <p className="text-[13px] text-ink-muted">
                    {new Date(r.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="mt-2 text-[15px]">
                  <a
                    href={`mailto:${r.email}?subject=${encodeURIComponent("Your harmony conversation")}`}
                    className="text-gold-text underline decoration-hairline underline-offset-4"
                  >
                    {r.email}
                  </a>
                </p>
                <p className="mt-3 text-[15px] text-ink-muted">
                  {PATH_LABEL[r.path] ?? r.path} ·{" "}
                  {r.attending === "together" ? "Coming together" : "Beginning alone"}
                  {r.timezone ? ` · ${r.timezone}` : ""}
                </p>
                {r.availability ? (
                  <p className="mt-3 border-t border-hairline pt-3 text-[15px] leading-relaxed">
                    Free: {r.availability}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </MemberSection>
    </div>
  );
}
