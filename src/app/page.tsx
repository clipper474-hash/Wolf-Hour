import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";
import { SITE_URL } from "@/lib/site";

// Compressed JPG (116 KB vs the 1.3 MB source PNG) — scrapers pull this on
// every share, so weight matters more than fidelity here.
const OG_IMAGE = {
  url: "/showcase/dashboard-og.jpg",
  width: 1200,
  height: 750,
  alt: "The Wolfhour dashboard — a live scene with a clock, greeting, and dock.",
};

export const metadata: Metadata = {
  title: "Wolfhour — A beautiful place to focus & study",
  description:
    "A calm, free study timer with ambient sounds and cinematic backgrounds — pomodoro blocks, per-subject study tracking, and gentle focus tools. No signup to start; works offline.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Wolfhour — A beautiful place to focus & study",
    description:
      "Live cinematic backgrounds, calming soundscapes, and gentle timers for deep, distraction-free focus.",
    siteName: "Wolfhour",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wolfhour — A beautiful place to focus & study",
    description:
      "Live cinematic backgrounds, calming soundscapes, and gentle timers for deep, distraction-free focus.",
    images: [OG_IMAGE],
  },
};

/** Rich result: tells Google this is a free web app in the Productivity
 *  category (rendered as an inert JSON-LD data block, not executable JS). */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Wolfhour",
  url: `${SITE_URL}/`,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  description:
    "A calm, free focus app — study timer, pomodoro blocks, ambient sounds, and live cinematic backgrounds for deep, distraction-free work.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  screenshot: `${SITE_URL}/showcase/dashboard-og.jpg`,
  image: `${SITE_URL}/brand/icon-512-maskable.png`,
  featureList: [
    "Live cinematic backgrounds",
    "Focus & study timers",
    "Aspirant study mode with per-subject analytics",
    "Calming soundscapes",
    "Tasks, streaks & badges",
    "Works offline with cross-device sync",
  ],
};

/** Public marketing landing page (root). The immersive app lives at /app.
 *  The global `body { overflow: hidden }` keeps the app full-bleed, so the
 *  landing scrolls inside its own dvh container. */
export default function LandingPage() {
  return (
    <main className="h-dvh overflow-y-auto scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Landing />
    </main>
  );
}
