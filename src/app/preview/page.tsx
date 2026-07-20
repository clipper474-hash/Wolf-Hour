import type { Metadata } from "next";
import { Preview } from "@/components/preview/Preview";

/** Redesign candidate — noindexed staging route. Not linked anywhere, not in
 *  the sitemap; robots noindex keeps it out of search while we evaluate it
 *  against the live landing. Delete this route (and src/components/preview)
 *  if the redesign is rejected, or promote it to app/page.tsx if approved. */
export const metadata: Metadata = {
  title: "Preview — Wolfhour redesign",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <main className="h-dvh overflow-y-auto scroll-smooth">
      <Preview />
    </main>
  );
}
