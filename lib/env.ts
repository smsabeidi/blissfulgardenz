// Environment access with one rule: the marketing site must never break because
// a platform key is missing. Every getter is optional and callers branch on it,
// so an unconfigured deploy renders the public site exactly as before and simply
// keeps the garden gate closed.

function opt(name: string): string | null {
  const v = process.env[name];
  return v && v.length > 0 ? v : null;
}

export const env = {
  supabaseUrl: () => opt("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: () => opt("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceKey: () => opt("SUPABASE_SERVICE_ROLE_KEY"),

  stripeSecret: () => opt("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: () => opt("STRIPE_WEBHOOK_SECRET"),
  priceBloomMonthly: () => opt("STRIPE_PRICE_BLOOM_MONTHLY"),
  priceBloomAnnual: () => opt("STRIPE_PRICE_BLOOM_ANNUAL"),
  priceBloomFounding: () =>
    opt("STRIPE_PRICE_BLOOM_FOUNDING_ANNUAL") ?? opt("STRIPE_PRICE_BLOOM_ANNUAL"),
  /**
   * Stripe Tax, off unless explicitly switched on.
   *
   * Stripe refuses to create a Checkout Session with automatic_tax enabled
   * until the account has a head office address, so leaving it hard-coded on
   * meant every single "Join" press failed with a 502 and nobody could pay.
   * It is a flag rather than a deletion because turning tax collection back on
   * should be one env var, not a code change: set STRIPE_AUTOMATIC_TAX=1 the
   * moment the origin address is configured in the Stripe dashboard.
   */
  stripeAutomaticTax: () => opt("STRIPE_AUTOMATIC_TAX") === "1",

  resendKey: () => opt("RESEND_API_KEY"),
  fromTransactional: () =>
    opt("EMAIL_FROM_TRANSACTIONAL") ?? "Blissful Gardenz <onboarding@resend.dev>",
  fromLetters: () => opt("EMAIL_FROM_LETTERS") ?? "Blissful Gardenz <onboarding@resend.dev>",
  teamEmail: () => opt("EMAIL_TO_TEAM"),

  muxTokenId: () => opt("MUX_TOKEN_ID"),
  muxTokenSecret: () => opt("MUX_TOKEN_SECRET"),
  muxSigningKeyId: () => opt("MUX_SIGNING_KEY_ID"),
  muxSigningKeyPrivate: () => opt("MUX_SIGNING_KEY_PRIVATE"),

  calBookingUrl: () => opt("NEXT_PUBLIC_CAL_BOOKING_URL"),
  siteUrl: () => opt("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
};

/** Is the platform layer configured at all? Gates the member routes. */
export function platformReady(): boolean {
  return Boolean(env.supabaseUrl() && env.supabaseAnonKey());
}

/** Is billing configured? Gates checkout surfaces. */
export function billingReady(): boolean {
  return Boolean(env.stripeSecret() && env.priceBloomMonthly());
}
