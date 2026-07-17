import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://wolfhour.vercel.app";

/** Newest mtime of the source files that make up a page — runs at build time,
 *  so lastmod tracks real content changes instead of a hardcoded date. */
function lastmod(...files: string[]): Date {
  const times = files.map((f) => statSync(join(process.cwd(), "src", f)).mtimeMs);
  return new Date(Math.max(...times));
}

/** Public, indexable pages only — /app is auth-gated, /reset-password is
 *  a transactional page; both are excluded here and disallowed in robots. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      lastModified: lastmod("app/page.tsx", "components/landing/Landing.tsx"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/pomodoro-timer`,
      lastModified: lastmod("app/(content)/pomodoro-timer/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/study-sounds`,
      lastModified: lastmod("app/(content)/study-sounds/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/aspirant-mode`,
      lastModified: lastmod("app/(content)/aspirant-mode/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: lastmod("app/(legal)/privacy/page.tsx"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: lastmod("app/(legal)/terms/page.tsx"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
