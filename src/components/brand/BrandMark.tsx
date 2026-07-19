"use client";

import Image from "next/image";
import { useUIStore } from "@/lib/ui-store";

/** Subtle official wordmark, top-left — shown across the app (incl. Aspirant
 *  Mode). Hidden only while the fullscreen timer is up, to stay immersive. */
export function BrandMark() {
  const timerFullscreen = useUIStore((s) => s.timerFullscreen);

  if (timerFullscreen) return null;

  return (
    <div
      className="af-brand-in pointer-events-none fixed left-5 top-4 z-20 flex select-none items-center gap-2"
    >
      <Image
        src="/brand/logo-white.png"
        alt="Wolfhour"
        width={388}
        height={420}
        sizes="28px"
        className="h-7 w-auto opacity-85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]"
      />
      <span className="text-[13px] font-semibold tracking-[0.14em] text-white/75 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
        WOLFHOUR
      </span>
    </div>
  );
}
