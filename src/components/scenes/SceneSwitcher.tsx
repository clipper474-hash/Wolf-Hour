"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { SCENES } from "@/lib/scenes";
import { useSceneStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Glass popover to switch the ambient scene. Anchored above the trigger icon,
 *  slides up out of it, and auto-closes after a pick (cross-dissolves the bg). */
export function SceneSwitcher({
  open,
  onClose,
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
}) {
  const sceneId = useSceneStore((s) => s.sceneId);
  const setScene = useSceneStore((s) => s.setScene);
  // Centered horizontally on screen, floating just above the dock.
  const [bottom, setBottom] = useState(92);

  // Vertical anchor: sit just above the trigger row (the dock).
  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setBottom(window.innerHeight - r.top + 14);
  }, [open, anchorRef]);

  const pick = (id: string) => {
    setScene(id);
    onClose(); // auto-disappear after choosing
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            aria-label="Close scene switcher"
            className="fixed inset-0 z-30 cursor-default"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Choose a scene"
            initial={{ opacity: 0, y: 22, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 18, scale: 0.92, x: "-50%" }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            style={{
              position: "fixed",
              left: "50%",
              bottom,
              transformOrigin: "bottom center",
              borderRadius: 22,
            }}
            className="glass z-40 max-w-[min(94vw,760px)] overflow-x-auto p-2"
          >
            <div className="flex items-end gap-1.5">
              {SCENES.map((s) => {
                const selected = s.id === sceneId;
                return (
                  <button
                    key={s.id}
                    onClick={() => pick(s.id)}
                    aria-pressed={selected}
                    className={cn(
                      "group relative flex w-[66px] shrink-0 flex-col items-center gap-1 rounded-xl p-1 transition-colors",
                      selected ? "dock-active" : "hover:bg-white/10"
                    )}
                  >
                    <span className="relative block h-10 w-full overflow-hidden rounded-lg ring-1 ring-white/15">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.poster}
                        alt={s.label}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {selected && (
                        <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent-500 text-white shadow">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-medium text-white/85">
                      {s.label}
                    </span>
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
