import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { MemberSection } from "@/components/member/section";
import { FilmGrid, type FilmRow } from "@/components/member/film-grid";
import { firstSeason } from "@/content/library";
import { hasFilm } from "@/lib/mux";

export const metadata = { title: "The Library" };

// The library index.
//
// One calm list rather than a grid grouped by pillar. Grouping looks tidier in a
// mockup and is worse here: with eight films, pillar headings produce sections of
// one or two items, which reads as a filing cabinet and pushes the actual films
// below the fold. A member arrives wanting to watch something, not to browse a
// taxonomy, so the list stays flat and the pillar rides along as a quiet label.
export default async function LibraryPage() {
  const access = await getAccess();
  const supabase = await createClient();

  // Members see the member films. The public "watch" page already handles the
  // free ones, and repeating them here would dilute what the membership is for.
  const films = firstSeason.filter((v) => v.locked);

  const progressBySlug = new Map<string, { seconds: number; completed: boolean }>();
  if (supabase && access.userId) {
    const { data } = await supabase
      .from("video_progress")
      .select("video_slug, seconds, completed")
      .eq("user_id", access.userId);
    for (const row of data ?? []) {
      progressBySlug.set(row.video_slug, { seconds: row.seconds, completed: row.completed });
    }
  }

  const rows: FilmRow[] = films.map((video) => {
    const p = progressBySlug.get(video.slug);
    return {
      video,
      seconds: p?.seconds ?? 0,
      completed: p?.completed ?? false,
      available: hasFilm(video.slug),
    };
  });

  const arriving = rows.filter((r) => !r.available).length;

  return (
    <div className="pb-24">
      <MemberSection
        as="h1"
        title="The library"
        lede="Short films for the season you are in. Watch in any order. Nothing here expects you to start at the beginning."
        width="reading"
      />

      {rows.length === 0 ? (
        <MemberSection width="reading">
          <p className="text-body text-ink-muted">
            The first films are being finished now. We will write to you the moment they arrive.
          </p>
        </MemberSection>
      ) : (
        <MemberSection width="wide">
          <FilmGrid rows={rows} />
          {arriving > 0 ? (
            <p className="mt-8 text-[15px] text-ink-muted">
              {arriving === 1
                ? "One more film is being finished and will appear here when it is ready."
                : `${arriving} more films are being finished and will appear here as they are ready.`}
            </p>
          ) : null}
        </MemberSection>
      )}
    </div>
  );
}
