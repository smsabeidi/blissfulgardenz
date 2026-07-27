"use client";

import { useCallback, useEffect, useRef } from "react";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";

// Keeps a member's place in a film. Renders nothing.
//
// Shape of the API: the tracker receives the player element itself and
// subscribes to it, rather than receiving callbacks the player has to remember
// to wire up. The player then knows nothing about persistence and the tracker
// owns the whole concern: throttling, the completion rule, and the flush on
// the way out. It mounts only once the element exists, so the subscription is
// never racing a ref that has not attached yet.

const ENDPOINT = "/api/mux/token?action=progress";

// At most one write per quarter minute while playing. Watching a 24 minute
// film costs about six rows of traffic.
const REPORT_INTERVAL_MS = 15_000;

// Below this, someone opened a film and changed their mind. Recording it would
// put a "continue watching" marker on a film they never really started.
const MIN_TRACKED_SECONDS = 5;

// Credits roll well before the final frame, so the last few percent never
// arrive for most viewers. 95 percent is watched.
const COMPLETE_RATIO = 0.95;

type ProgressTrackerProps = {
  slug: string;
  player: MuxPlayerRefAttributes;
};

export function ProgressTracker({ slug, player }: ProgressTrackerProps) {
  const latest = useRef({ seconds: 0, duration: 0 });
  const lastSentAt = useRef(0);
  const lastSentSeconds = useRef(-1);

  const send = useCallback(
    (useBeacon: boolean) => {
      const { seconds, duration } = latest.current;
      if (seconds < MIN_TRACKED_SECONDS) return;
      if (Math.abs(seconds - lastSentSeconds.current) < 1) return;

      const completed = duration > 0 && seconds / duration >= COMPLETE_RATIO;
      const payload = JSON.stringify({
        slug,
        seconds: Math.floor(seconds),
        completed,
      });

      lastSentAt.current = Date.now();
      lastSentSeconds.current = seconds;

      // sendBeacon survives the page going away, which is the whole reason
      // this lives on a route instead of in a Server Action.
      if (useBeacon && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(
          ENDPOINT,
          new Blob([payload], { type: "application/json" })
        );
        return;
      }

      // Failures are swallowed on purpose. A lost bookmark is a small thing;
      // an error surfacing over someone's film is not.
      void fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    },
    [slug]
  );

  useEffect(() => {
    const readPosition = () => {
      const duration = Number.isFinite(player.duration) ? player.duration : 0;
      latest.current = { seconds: player.currentTime, duration };
    };

    const onTimeUpdate = () => {
      readPosition();
      if (Date.now() - lastSentAt.current >= REPORT_INTERVAL_MS) send(false);
    };

    const onPause = () => {
      readPosition();
      send(false);
    };

    const onEnded = () => {
      const duration = Number.isFinite(player.duration) ? player.duration : 0;
      // Park the resume point at the end so the row reads as watched even if
      // the last timeupdate landed a second short.
      latest.current = { seconds: duration, duration };
      send(false);
    };

    // pagehide covers closing the tab, navigating away, and the iOS back-forward
    // cache, where unload never fires.
    const onPageHide = () => {
      readPosition();
      send(true);
    };

    player.addEventListener("timeupdate", onTimeUpdate);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      player.removeEventListener("timeupdate", onTimeUpdate);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
      window.removeEventListener("pagehide", onPageHide);
      // Client side navigation away from the film: the request has to outlive
      // this component, so beacon it.
      readPosition();
      send(true);
    };
  }, [player, send]);

  return null;
}
