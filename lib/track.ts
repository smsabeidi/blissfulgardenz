import type { TrackEvent } from "@/content/site";

// PRD §14 event taxonomy, wired as a typed no-op this phase. The platform
// phase swaps the body for GA4 + server-side key conversions; every call
// site is already in place.
export function track(event: TrackEvent, data?: Record<string, string | number>) {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[track] ${event}`, data ?? {});
  }
}
