"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import type {
  MuxPlayerCSSProperties,
  MuxPlayerRefAttributes,
} from "@mux/mux-player-react";

import { ProgressTracker } from "./progress-tracker";

// The film itself. The playback token is fetched after mount, from the one
// route that checks membership, so nothing playable is ever baked into the
// HTML. Everything else here is about the states around the film: a film being
// prepared, a slow network, a request that failed. Each gets a calm panel
// rather than a broken frame.

type FilmPlayerProps = {
  slug: string;
  title: string;
  /** Local still used as the poster frame. Never a signed Mux thumbnail. */
  poster: string;
  /** The server already knows whether an asset exists. Saves a doomed request. */
  available: boolean;
  /** Where this member stopped last time, in seconds. */
  startTime?: number;
};

type PlayerState =
  | { phase: "loading" }
  | { phase: "ready"; playbackId: string; token: string | null }
  | { phase: "arriving" }
  | { phase: "error" };

export function FilmPlayer({
  slug,
  title,
  poster,
  available,
  startTime,
}: FilmPlayerProps) {
  const [state, setState] = useState<PlayerState>(
    available ? { phase: "loading" } : { phase: "arriving" }
  );
  const [player, setPlayer] = useState<MuxPlayerRefAttributes | null>(null);

  useEffect(() => {
    if (!available) {
      setState({ phase: "arriving" });
      return;
    }

    const controller = new AbortController();
    setState({ phase: "loading" });

    void (async () => {
      try {
        const response = await fetch("/api/mux/token", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug }),
          signal: controller.signal,
        });

        // 404 means the film has no asset yet. 403 means this person is not a
        // member, which the page has already said more gracefully than a
        // broken player could, so it reads the same as nothing to play.
        if (response.status === 404 || response.status === 403) {
          setState({ phase: "arriving" });
          return;
        }
        if (!response.ok) {
          setState({ phase: "error" });
          return;
        }

        const payload = readPlayback(await response.json());
        setState(payload ? { phase: "ready", ...payload } : { phase: "error" });
      } catch {
        if (!controller.signal.aborted) setState({ phase: "error" });
      }
    })();

    return () => controller.abort();
  }, [available, slug]);

  if (state.phase === "ready") {
    return (
      <>
        <Frame>
          <MuxPlayer
            ref={setPlayer}
            playbackId={state.playbackId}
            tokens={state.token ? { playback: state.token } : undefined}
            streamType="on-demand"
            poster={poster}
            title={title}
            metadata={{ video_id: slug, video_title: title }}
            startTime={startTime}
            playsInline
            accentColor="#c9a227"
            primaryColor="#f3f1e6"
            secondaryColor="rgba(11, 21, 18, 0.55)"
            className="h-full w-full"
            style={playerChrome}
          />
        </Frame>
        {player ? <ProgressTracker slug={slug} player={player} /> : null}
      </>
    );
  }

  return (
    <Frame>
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 62rem, 100vw"
        className="object-cover opacity-40"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,13,0.45)_0%,rgba(8,18,13,0.78)_100%)]" />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        {state.phase === "loading" ? (
          <p role="status" className="text-meta text-[#e3c25b]">
            Opening the film
          </p>
        ) : state.phase === "error" ? (
          <>
            <p className="text-meta text-[#e3c25b]">Not available right now</p>
            <p className="text-display-sm text-brand-ink">
              The film did not open.
            </p>
            <p className="text-body max-w-sm text-brand-ink-muted">
              Refresh the page to try again. If it keeps happening, write to us
              and we will look into it.
            </p>
          </>
        ) : (
          <>
            <p className="text-meta text-[#e3c25b]">Arriving soon</p>
            <p className="text-display-sm text-brand-ink">
              This film is being prepared.
            </p>
            <p className="text-body max-w-sm text-brand-ink-muted">
              It joins the library as soon as it is ready. Your membership
              already includes it.
            </p>
          </>
        )}
      </div>
    </Frame>
  );
}

// One frame for every state, so a film appearing does not resize the page.
// data-ground="dark" swaps the focus ring to gold over the dark ground.
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-ground="dark"
      className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-brand-deep ring-1 ring-hairline"
    >
      {children}
    </div>
  );
}

// Minimal chrome: the house gold on the scrubber, a soft green scrim behind the
// controls instead of the player default black. The default control set stays
// whole, including the skip buttons, which earn their place on a phone.
const playerChrome: MuxPlayerCSSProperties = {
  "--controls-backdrop-color": "rgba(8, 18, 13, 0.35)",
  "--media-object-fit": "contain",
  "--media-control-hover-background": "rgba(201, 162, 39, 0.22)",
};

function readPlayback(
  data: unknown
): { playbackId: string; token: string | null } | null {
  if (typeof data !== "object" || data === null) return null;
  const record: Record<string, unknown> = { ...data };

  const playbackId = record.playbackId;
  if (typeof playbackId !== "string" || playbackId.length === 0) return null;

  const token = record.token;
  return {
    playbackId,
    token: typeof token === "string" && token.length > 0 ? token : null,
  };
}
