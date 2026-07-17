import type { MetadataRoute } from "next";

const BASE = "https://wolfhour.vercel.app";

/** Public, indexable pages only — /app is auth-gated, /reset-password is
 *  a transactional page; both are excluded here and disallowed in robots. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
