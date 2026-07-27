import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccess } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { FilmPlayer } from "@/components/member/film-player";
import { filmPhoto } from "@/components/member/film-grid";
import { firstSeason } from "@/content/library";
import { hasFilm } from "@/lib/mux";

// The watch page.
//
// No generateStaticParams: the page is member-gated and reads this person's
// position in the film, so prerendering it would either leak a member surface
// into the static build or serve everyone the first viewer's progress.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = firstSeason.find((v) => v.slug === slug);
  return { title: film ? film.title : "Film" };
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = firstSeason.find((v) => v.slug === slug && v.locked);
  if (!film) notFound();

  const access = await getAccess();
  const supabase = await createClient();

  let startTime = 0;
  if (supabase && access.userId) {
    const { data } = await supabase
      .from("video_progress")
      .select("seconds, completed")
      .eq("user_id", access.userId)
      .eq("video_slug", slug)
      .maybeSingle();
    // Resume only if they are genuinely mid-film. Dropping someone back at
    // 23:58 of a 24 minute film is worse than starting it over.
    if (data && !data.completed) startTime = data.seconds;
  }

  return (
    <article className="pb-24 pt-10 sm:pt-14">
      <FilmPlayer
        slug={film.slug}
        title={film.title}
        poster={filmPhoto(film.pillar)}
        available={hasFilm(film.slug)}
        startTime={startTime}
      />

      <div className="mx-auto mt-10 flex max-w-[65ch] flex-col gap-5">
        <p className="text-meta text-gold-text">
          {film.pillar}. {film.topic}.
        </p>
        <h1 className="text-display text-balance">{film.title}</h1>
        <p className="text-body text-ink-muted">{film.description}</p>
        <p className="text-[15px] text-ink-muted">{film.duration}</p>

        <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/garden/notes?context=film:${film.slug}`}
            className="text-[15px] font-medium text-gold-text underline-offset-4 hover:underline"
          >
            Write a private note about this film
          </Link>
          <Link
            href="/garden/library"
            className="text-[15px] text-ink-muted underline-offset-4 hover:underline"
          >
            Back to the library
          </Link>
        </div>
      </div>
    </article>
  );
}
