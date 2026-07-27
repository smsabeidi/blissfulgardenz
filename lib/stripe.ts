import Stripe from "stripe";
import { env } from "@/lib/env";

// Stripe is the system of record for MONEY. Postgres is the system of record for
// ACCESS. Nothing in this file reads or decides entitlement; it only builds the
// client and resolves price ids.
//
// The client is constructed lazily because every key in this project is
// optional: a deploy with no Stripe keys must still render the marketing site,
// so `getStripe()` returns null rather than throwing at import time.

// Pinned, not floating. An unpinned integration silently changes shape when
// Stripe ships a new API version, and billing is the last place that should
// surprise us. This matches the version the installed SDK's types describe, so
// the request and the type definitions can never drift apart.
export const STRIPE_API_VERSION = "2026-06-24.dahlia";

export const PLAN_KEYS = ["monthly", "annual", "founding"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

// Cached per warm serverless instance. The key is stored alongside so a rotated
// secret in a new environment cannot be served by a stale client.
let cachedClient: Stripe | null = null;
let cachedSecret: string | null = null;

export function getStripe(): Stripe | null {
  const secret = env.stripeSecret();
  if (!secret) return null;

  if (cachedClient && cachedSecret === secret) return cachedClient;

  cachedClient = new Stripe(secret, {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
    // Stripe's own guidance for idempotent-by-construction calls. Retries here
    // absorb a transient network blip instead of surfacing as a failed join.
    maxNetworkRetries: 2,
    appInfo: {
      name: "Blissful Gardenz",
      url: "https://blissfulgardenz.com",
    },
  });
  cachedSecret = secret;
  return cachedClient;
}

// Lazy getters rather than a resolved object: env is read at call time so a
// price id added in the Vercel dashboard takes effect on the next request
// rather than the next cold start.
export const PRICES: Record<PlanKey, () => string | null> = {
  monthly: () => env.priceBloomMonthly(),
  annual: () => env.priceBloomAnnual(),
  founding: () => env.priceBloomFounding(),
};

export function priceIdFor(plan: PlanKey): string | null {
  return PRICES[plan]();
}

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && (PLAN_KEYS as readonly string[]).includes(value);
}

/**
 * Was this price the founding-cohort price?
 *
 * `env.priceBloomFounding()` deliberately falls back to the annual price when no
 * dedicated founding price is configured. Without the inequality check below,
 * that fallback would stamp every ordinary annual member as 'founding' and
 * quietly corrupt the cohort we want to be able to write to for the rest of the
 * brand's life.
 */
export function isFoundingPriceId(priceId: string | null | undefined): boolean {
  if (!priceId) return false;
  const founding = env.priceBloomFounding();
  if (!founding || founding !== priceId) return false;
  return founding !== env.priceBloomAnnual();
}

/**
 * Stripe redirect targets must be absolute, and both the checkout and portal
 * routes need the same base. One implementation so the two can never disagree
 * about a trailing slash.
 */
export function absoluteUrl(path: string): string {
  const base = env.siteUrl().replace(/\/+$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
