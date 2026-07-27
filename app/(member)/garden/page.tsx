import Link from "next/link";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { MemberSection } from "@/components/member/section";
import { firstSeason } from "@/content/library";
import { hasFilm } from "@/lib/mux";

export const metadata = { title: "The Garden" };

// The member home.
//
// Deliberately NOT a dashboard. No counters, no streaks, no completion rings,
// no "you have watched 3 of 8". This membership is used by people in the middle
// of something hard, and a scoreboard turns a marriage into a performance. The
// surface answers two quiet questions instead: where was I, and what is here.

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function GardenHome() {
  const access = await getAccess();
  const supabase = await createClient();

  let displayName: string | null = null;
  let resume: { slug: string; seconds: number } | null = null;
  let recentNotes: { id: string; body: string; updated_at: string }[] = [];

  if (supabase && access.userId) {
    const [profileRes, progressRes, notesRes] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", access.userId).maybeSingle(),
      supabase
        .from("video_progress")
        .select("video_slug, seconds, completed")
        .eq("user_id", access.userId)
        .eq("completed", false)
        .order("updated_at", { ascending: false })
        .limit(1),
      supabase
        .from("notes")
        .select("id, body, updated_at")
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(2),
    ]);

    displayName = profileRes.data?.display_name ?? null;
    const p = progressRes.data?.[0];
    if (p) resume = { slug: p.video_slug, seconds: p.seconds };
    recentNotes = notesRes.data ?? [];
  }

  const resumeFilm = resume ? firstSeason.find((v) => v.slug === resume.slug) ?? null : null;
  const available = firstSeason.filter((v) => v.locked && hasFilm(v.slug));
  const firstFilm = available[0] ?? firstSeason.find((v) => v.locked) ?? null;
  const isNew = !resumeFilm && recentNotes.length === 0;

  return (
    <div className="pb-24">
      <MemberSection
        as="h1"
        title={displayName ? `${greeting()}, ${displayName}.` : `${greeting()}.`}
        lede={
          isNew
            ? "The garden is yours now. There is no order to any of this, and nothing here is keeping score."
            : undefined
        }
        width="reading"
      >
        {isNew ? (
          <div className="mt-2 flex flex-col gap-8">
            <p className="text-body text-ink-muted">
              Inside you will find the films, the guides in the vault, and a private page that only
              you can read. When you would like to speak with Dr. Laiyemo, a conversation is a few
              taps away.
            </p>
            <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
              <StartRow
                href={firstFilm ? `/garden/library/${firstFilm.slug}` : "/garden/library"}
                title={firstFilm ? `Begin with ${firstFilm.title}` : "Open the library"}
                note={firstFilm ? `${firstFilm.duration}. ${firstFilm.topic}.` : "The first season of films."}
              />
              <StartRow
                href="/garden/notes"
                title="Write something down"
                note="Private to you. Not visible to anyone else."
              />
              <StartRow
                href="/garden/vault"
                title="Look through the vault"
                note="Guides and workbooks to keep."
              />
            </ul>
          </div>
        ) : null}
      </MemberSection>

      {resumeFilm ? (
        <MemberSection
          title="Where you left off"
          width="reading"
          action={
            <Link
              href="/garden/library"
              className="text-[15px] font-medium text-gold-text underline-offset-4 hover:underline"
            >
              All films
            </Link>
          }
        >
          <Link
            href={`/garden/library/${resumeFilm.slug}`}
            className="group flex flex-col gap-1 rounded-[2rem] border border-hairline px-7 py-6 transition-colors duration-200 hover:bg-surface"
          >
            <span className="text-meta text-gold-text">{resumeFilm.pillar}</span>
            <span className="text-display-sm group-hover:text-gold-text">{resumeFilm.title}</span>
            <span className="text-[15px] text-ink-muted">
              {minutesIn(resume?.seconds ?? 0)} in, of {resumeFilm.duration}
            </span>
          </Link>
        </MemberSection>
      ) : null}

      {recentNotes.length > 0 ? (
        <MemberSection
          title="Recently written"
          width="reading"
          action={
            <Link
              href="/garden/notes"
              className="text-[15px] font-medium text-gold-text underline-offset-4 hover:underline"
            >
              Your pages
            </Link>
          }
        >
          <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
            {recentNotes.map((n) => (
              <li key={n.id} className="py-5">
                <Link href="/garden/notes" className="group flex flex-col gap-1">
                  <span className="text-body line-clamp-2 group-hover:text-gold-text">
                    {firstLine(n.body)}
                  </span>
                  <span className="text-[13px] text-ink-muted">{when(n.updated_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </MemberSection>
      ) : null}

      {!isNew ? (
        <MemberSection title="Also here" width="reading">
          <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
            <StartRow href="/garden/library" title="The library" note="Films for the season you are in." />
            <StartRow href="/garden/vault" title="The vault" note="Guides and workbooks to keep." />
            <StartRow
              href="/garden/conversations"
              title="A conversation"
              note="Sixty unhurried minutes with Dr. Laiyemo."
            />
          </ul>
        </MemberSection>
      ) : null}
    </div>
  );
}

function StartRow({ href, title, note }: { href: string; title: string; note: string }) {
  return (
    <li>
      <Link href={href} className="group flex min-h-14 items-center justify-between gap-6 py-5">
        <span className="flex flex-col gap-0.5">
          <span className="text-display-sm group-hover:text-gold-text">{title}</span>
          <span className="text-[15px] text-ink-muted">{note}</span>
        </span>
        <span aria-hidden className="text-gold-text transition-transform duration-200 group-hover:translate-x-1">
          &rarr;
        </span>
      </Link>
    </li>
  );
}

function minutesIn(seconds: number): string {
  const m = Math.max(1, Math.round(seconds / 60));
  return `${m} minute${m === 1 ? "" : "s"}`;
}

function firstLine(body: string): string {
  const line = body.trim().split("\n")[0] ?? "";
  return line.length > 140 ? `${line.slice(0, 140)}...` : line;
}

function when(iso: string): string {
  const then = new Date(iso);
  const days = Math.floor((Date.now() - then.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
