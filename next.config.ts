import type { NextConfig } from "next";

// Content-Security-Policy. This app is fully self-hosted (next/font self-hosts
// fonts, all scenes/images/video are local, no remote fetch/CDN/analytics), so
// every source is 'self'. Nonce-based CSP was rejected on purpose: in Next 16 it
// forces every page into dynamic rendering (no static/CDN/PPR), which would
// sabotage the 98–100 Lighthouse/SEO target — and this is a local-first app with
// no backend, auth, or server-side secrets to protect. 'unsafe-inline' is the
// known ceiling for Next's inline hydration script/style; 'unsafe-eval' is dev-only
// (React uses eval for debug stacks). Upgrade path: switch to nonces via proxy.ts
// only if a backend/auth with sensitive data ever lands.
// ponytail: static CSP with 'unsafe-inline'; move to nonces if sensitive backend appears.
const isDev = process.env.NODE_ENV === "development";
// Supabase auth/data calls go to https://<project>.supabase.co (+ realtime wss).
// Allow them in connect-src; harmless when auth is unconfigured.
const supabaseConnect = "https://*.supabase.co wss://*.supabase.co";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "media-src 'self'",
  "font-src 'self'",
  `connect-src 'self' ${supabaseConnect}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Baseline security headers (safe, non-breaking layer).
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // clickjacking
  { key: "X-Content-Type-Options", value: "nosniff" }, // MIME sniffing
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  }, // HTTPS-only (prod)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next doesn't pick up the
  // stray lockfile in the home directory when inferring Turbopack root.
  turbopack: {
    root: __dirname,
  },
  poweredByHeader: false, // don't advertise the stack
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Heavy static assets (63MB of scene video/posters, brand art,
      // screenshots) never change in place — new content gets a new filename.
      // Immutable year-long cache = repeat visitors serve them from browser
      // cache with zero requests. Biggest per-user bandwidth lever.
      {
        source: "/:dir(scenes|showcase|brand|sounds)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
