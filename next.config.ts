import type { NextConfig } from "next";

// Content Security Policy.
//
// Shipped in REPORT-ONLY first, deliberately. A CSP that is wrong does not
// degrade a page, it breaks it — one missed host and the film stops playing or
// sign-in stops working, in production, for everyone. Report-Only applies the
// identical policy and reports what *would* have been blocked without blocking
// anything, so it can be proven against real traffic before it is enforced.
// Rename the header to `Content-Security-Policy` once the reports are clean.
//
// 'unsafe-inline' in script-src is a considered trade, not an oversight. The
// alternative is a per-request nonce, which needs middleware on every route,
// which would opt the whole marketing site into dynamic rendering — the exact
// thing middleware.ts is scoped to avoid. What that buys back is small here:
// this app renders no user-supplied HTML, every dangerouslySetInnerHTML is a
// static theme bootstrap or JSON-LD with `<` escaped, and member-written text
// (notes) is rendered as React children, which escapes by construction.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https://*.mux.com https://stream.mux.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.mux.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  // Checkout is a hosted redirect, but a form posting to Stripe must stay legal.
  "form-action 'self' https://checkout.stripe.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Clickjacking. The member area and the billing portal are the pages actually
  // worth framing, so this is not decorative. frame-ancestors above says the
  // same for modern browsers; this covers the ones that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  // Stops a browser second-guessing a Content-Type and running a response as script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Never leak a member's path (/garden/notes and friends) to a third party.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs any of these; denying them removes the question.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Vercel already sends HSTS; this pins the stronger form.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const nextConfig: NextConfig = {
  // Removes the `x-powered-by: Next.js` version banner.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
