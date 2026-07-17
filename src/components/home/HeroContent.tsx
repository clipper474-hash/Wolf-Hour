"use client";

import { AnimatePresence, motion } from "motion/react";
import { useUIStore } from "@/lib/ui-store";
import { usePrefsStore } from "@/lib/prefs-store";
import { reveal, softSpring, staggerParent } from "@/lib/motion";
import { Clock } from "@/components/clock/Clock";
import { Greeting } from "./Greeting";
import { Quote } from "./Quote";
import { FocusTimer } from "@/components/focus/FocusTimer";
import { AspirantMode } from "@/components/aspirant/AspirantMode";

/** The morphing center stage — Home (clock/greeting/quote) ↔ Focus ↔ Aspirant. */
export function HeroContent() {
  const mode = useUIStore((s) => s.mode);
  const clockPickerOpen = useUIStore((s) => s.clockPickerOpen);
  const setClockPickerOpen = useUIStore((s) => s.setClockPickerOpen);
  const name = usePrefsStore((s) => s.name);

  return (
    <div className="relative z-10 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {mode === "aspirant" ? (
          <AspirantMode key="aspirant" />
        ) : mode === "focus" ? (
          <motion.div
            key="focus"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
            transition={softSpring}
          >
            <FocusTimer />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            variants={staggerParent}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 1.18, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 px-6 text-center"
            style={{ textShadow: "0 2px 28px rgba(0,0,0,0.42)" }}
          >
            <motion.div variants={reveal} transition={softSpring}>
              <Quote />
            </motion.div>
            <motion.div variants={reveal} transition={softSpring}>
              <Greeting name={name.trim() || undefined} />
            </motion.div>
            <motion.div variants={reveal} transition={softSpring}>
              <button
                onClick={() => setClockPickerOpen(true)}
                aria-label="Change clock style"
                className="cursor-pointer rounded-3xl outline-none transition-transform hover:scale-[1.015] focus-visible:ring-2 focus-visible:ring-white/40"
                title="Change clock style"
              >
                <Clock />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
