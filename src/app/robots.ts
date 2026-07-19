import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /app and /reset-password are kept out of results via noindex meta on the
// pages themselves — not robots Disallow, which would stop Google from ever
// reading that noindex. Named AI agents are granted explicitly so consent
// stays unambiguous even if the wildcard rule tightens later.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
