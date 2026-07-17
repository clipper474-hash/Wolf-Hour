"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { ASPIRANT_QUOTES } from "@/lib/aspirant-quotes";
import { useMotionTier } from "@/lib/useMotionTier";

/** Rotating confidence/focus line — calm crossfade, gentle cadence. */
export function MotivationBanner() {
  const { reduced } = useMotionTier();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % ASPIRANT_QUOTES.length),
      15 * 60 * 1000 // rotate every 15 minutes
    );
    return () => window.clearInterval(t);
  }, [reduced]);

  return (
    <div className="flex min-h-[52px] items-center justify-center gap-2.5 px-4 text-center">
      <Sparkles size={15} className="shrink-0 text-white/45" />
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[15px] font-medium text-white/80"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        >
          {ASPIRANT_QUOTES[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
