"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { CLOCK_PRESETS, clockFaceStyle } from "@/lib/clock-styles";
import { useClockStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Glass popover: pick a clock/font style + 12·24h + seconds. Live previews. */
export function ClockStylePicker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { presetId, setPreset } = useClockStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            aria-label="Close clock styles"
            className="fixed inset-0 z-30 cursor-default"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Clock & font style"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="glass fixed bottom-24 left-1/2 z-40 w-[min(92vw,560px)] -translate-x-1/2 p-3"
            style={{ borderRadius: 22, transformOrigin: "bottom center" }}
          >

            {/* style grid */}
            <div className="grid grid-cols-3 gap-2">
              {CLOCK_PRESETS.map((p) => {
                const selected = p.id === presetId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    aria-pressed={selected}
                    className={cn(
                      "relative flex h-16 flex-col items-center justify-center gap-1 rounded-xl px-2 transition-colors",
                      selected ? "dock-active" : "hover:bg-white/10"
                    )}
                  >
                    <span
                      className={cn("leading-none", p.shimmer && "clock-shimmer")}
                      style={{
                        fontFamily: p.font,
                        fontWeight: p.weight,
                        letterSpacing: p.tracking,
                        fontSize: "1.6rem",
                        ...clockFaceStyle(p, 0.32),
                      }}
                    >
                      10:24
                    </span>
                    <span className="text-[10px] font-medium text-white/70">{p.label}</span>
                    {selected && (
                      <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-white/25 text-white">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
