import { VideoBackground } from "@/components/background/VideoBackground";
import { HeroContent } from "@/components/home/HeroContent";
import { Dock } from "@/components/dock/Dock";

/** The immersive focus dashboard. Moved from `/` → `/app` so the marketing
 *  landing page can own the root URL (better SEO + the public entry point).
 *  PWA/TWA start_url points here (see src/app/manifest.ts). */
export default function AppDashboard() {
  return (
    <main className="relative flex h-dvh flex-col items-center justify-center overflow-hidden">
      <VideoBackground />
      <HeroContent />
      <Dock />
    </main>
  );
}
