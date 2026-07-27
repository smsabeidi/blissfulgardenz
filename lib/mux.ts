// Mux helpers. SERVER ONLY: this module reads signing secrets and mints
// playback tokens, so it must never be imported from a client component. The
// `server-only` package is not installed here, so the guard is convention plus
// the fact that every key it reads is an unprefixed env var (never bundled).

import { createSign } from "node:crypto";
import { env } from "@/lib/env";

/**
 * Film slug to Mux playback id.
 *
 * Empty on purpose. Films are authored in `@/content/library` long before their
 * assets are encoded, so this map is the single seam where the operator says
 * "this one is ready": upload to Mux, paste the playback id against the slug,
 * deploy. A slug that is absent here is not broken, it is simply not filmed
 * yet, and every surface renders the honest "arriving soon" state instead.
 *
 * When the film catalogue outgrows a hand edit, this map is what a CMS lookup
 * replaces. Nothing else in the app reads playback ids directly.
 */
export const MUX_PLAYBACK_IDS: Record<string, string> = {};

/** Playback id for a film slug, or null when the asset does not exist yet. */
export function getPlaybackId(slug: string): string | null {
  // Own-property check: a slug arriving from a URL must never resolve through
  // the object prototype ("constructor", "toString", and friends).
  if (!Object.hasOwn(MUX_PLAYBACK_IDS, slug)) return null;
  const id = MUX_PLAYBACK_IDS[slug];
  return typeof id === "string" && id.length > 0 ? id : null;
}

/** True when a film can actually be watched right now. */
export function hasFilm(slug: string): boolean {
  return getPlaybackId(slug) !== null;
}

/**
 * Mux signed-playback audiences. "v" is the video stream itself; "t" and "s"
 * cover the thumbnail and storyboard endpoints, which only need tokens if the
 * operator later turns on scrub previews served from image.mux.com. The player
 * here posters from a local image, so "v" is all we mint today.
 */
export type MuxAudience = "v" | "t" | "s" | "d";

// Two hours. Long enough that nobody is interrupted mid film, short enough that
// a token lifted from a network log is dead by the same afternoon.
const TOKEN_TTL_SECONDS = 60 * 60 * 2;

/**
 * Mint a Mux signed playback token, or return null when signing keys are not
 * configured. Null is a supported answer, not a failure: in development the
 * asset usually carries a public playback policy, and the player simply omits
 * the token. Signed playback in production is what makes the paywall real.
 *
 * Mux expects a plain RS256 JWT:
 *   header  { alg: "RS256", typ: "JWT", kid: <signing key id> }
 *   payload { sub: <playback id>, aud: <audience>, exp: <unix seconds>, iat }
 *
 * Written against node:crypto rather than a JWT library because no JWT library
 * is installed and this is forty lines of standard base64url plus one signature.
 */
export function signPlaybackToken(
  playbackId: string,
  audience: MuxAudience = "v"
): string | null {
  const keyId = env.muxSigningKeyId();
  const rawKey = env.muxSigningKeyPrivate();
  if (!keyId || !rawKey) return null;

  const privateKey = readPrivateKey(rawKey);
  if (!privateKey) return null;

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT", kid: keyId };
  const payload = {
    sub: playbackId,
    aud: audience,
    exp: issuedAt + TOKEN_TTL_SECONDS,
    iat: issuedAt,
  };

  const signingInput = `${encodeSegment(header)}.${encodeSegment(payload)}`;

  try {
    const signer = createSign("RSA-SHA256");
    signer.update(signingInput);
    signer.end();
    const signature = signer.sign(privateKey).toString("base64url");
    return `${signingInput}.${signature}`;
  } catch {
    // A malformed key must not take the watch page down. The caller treats a
    // null token as "unsigned playback", and Mux refuses the stream if the
    // asset actually requires signing, which is the correct failure direction.
    return null;
  }
}

function encodeSegment(value: object): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

/**
 * Mux hands out signing keys base64 encoded, but operators paste whatever they
 * have in front of them, so accept a raw PEM too. Escaped newlines are the
 * usual casualty of pasting a PEM into a dashboard field, so repair those.
 */
function readPrivateKey(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.includes("BEGIN")) return trimmed.replace(/\\n/g, "\n");

  try {
    const decoded = Buffer.from(trimmed, "base64").toString("utf8");
    return decoded.includes("BEGIN") ? decoded : null;
  } catch {
    return null;
  }
}
