import type { MetadataRoute } from "next";

/** PWA manifest — also the foundation for the planned Google Play (TWA) ship. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wolfhour — Focus & Ambience",
    short_name: "Wolfhour",
    description:
      "A calm, free focus app — study timer, ambient sounds, and live animated backgrounds.",
    // The immersive app lives at /app; the marketing landing owns "/".
    // Installed PWA / TWA launches straight into the app.
    start_url: "/app",
    // Stable PWA identity — keeps installs intact if start_url ever changes.
    id: "/app",
    categories: ["productivity", "education"],
    display: "standalone",
    background_color: "#0d0b12",
    theme_color: "#14101a",
    orientation: "portrait-primary",
    icons: [
      { src: "/brand/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
