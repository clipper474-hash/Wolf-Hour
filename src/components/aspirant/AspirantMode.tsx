"use client";

import { AnimatePresence, motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { useUIStore } from "@/lib/ui-store";
import { useAspirantStore } from "@/lib/aspirant-store";
import { usePrefsStore } from "@/lib/prefs-store";
import { MotivationBanner } from "./MotivationBanner";
import { ExamCountdown } from "./ExamCountdown";
import { SubjectTimers } from "./SubjectTimers";
import { SubjectGoals } from "./SubjectGoals";
import { StudyCalendar } from "./StudyCalendar";
import { Analytics } from "./Analytics";
import { FullscreenTimer } from "./FullscreenTimer";
import { useMotionTier } from "@/lib/useMotionTier";

/**
 * Aspirant Mode — its own study "dimension". A full-bleed liquid-glass world
 * with its own dock; each feature (Timer · Goals · Calendar · Stats) is a
 * separate panel switched from that dock.
 */
export function AspirantMode() {
  const panel = useUIStore((s) => s.aspirantPanel);
  const timerFullscreen = useUIStore((s) => s.timerFullscreen);
  const running = useAspirantStore((s) => s.running);
  const name = usePrefsStore((s) => s.name).trim();
  const { reduced } = useMotionTier();

  // While the immersive timer runs, hide the panels so the scene shows clean.
  const timerTakeover = timerFullscreen && !!running;

  return (
    <motion.div
      key="aspirant"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: reduced ? 0.25 : 0.3 }}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      {/* ── Cinematic "lock-in" entrance: dark doors split open with a seam of
          light while the study world pulls into focus. One-shot, on mount. ── */}
      {!reduced && !timerTakeover && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-101%" }}
            transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1], delay: 0.12 }}
            className="absolute inset-x-0 top-0 h-1/2"
            style={{ background: "linear-gradient(180deg,#0a090d,#070609)" }}
          />
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "101%" }}
            transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1], delay: 0.12 }}
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: "linear-gradient(0deg,#0a090d,#070609)" }}
          />
          {/* seam of light along the parting */}
          <motion.div
            initial={{ scaleX: 0.15, opacity: 0 }}
            animate={{ scaleX: [0.15, 1.1, 1.1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.12, times: [0, 0.45, 1] }}
            className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(125,249,255,0.95),rgba(147,197,253,0.9),transparent)",
              filter: "blur(0.5px)",
              boxShadow: "0 0 22px rgba(125,249,255,0.7)",
            }}
          />
        </div>
      )}

      {!timerTakeover && (
        <>
          {/* fixed (not absolute) so the dim stays full-viewport while the panel
              scrolls — otherwise the overlay scrolls away and only the top dims. */}
          <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 26, scale: 1.05, filter: "blur(12px)" }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.34, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto flex min-h-full w-full max-w-2xl flex-col gap-4 px-5 pb-32 pt-14"
          >
            <header className="flex flex-col items-center gap-2 text-center">
              <span className="flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 text-[12px] font-semibold text-white/80 ring-1 ring-white/15">
                <GraduationCap size={15} /> Aspirant Mode
              </span>
              {name && (
                <p
                  className="font-display text-[26px] font-semibold leading-tight text-white sm:text-[30px]"
                  style={{ textShadow: "0 2px 22px rgba(0,0,0,0.5)" }}
                >
                  Let&apos;s go, {name}.
                </p>
              )}
              <MotivationBanner />
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={panel}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {panel === "timer" && (
                  <div className="space-y-4">
                    <ExamCountdown />
                    <SubjectTimers />
                  </div>
                )}
                {panel === "goals" && <SubjectGoals />}
                {panel === "calendar" && <StudyCalendar />}
                {panel === "stats" && <Analytics />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {/* Immersive full-screen running timer — clean scene, no page behind. */}
      <FullscreenTimer />
    </motion.div>
  );
}
