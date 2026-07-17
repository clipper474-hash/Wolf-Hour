"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useAspirantStore } from "@/lib/aspirant-store";
import {
  monthGrid,
  monthLabel,
  WEEKDAYS,
  todayISO,
  toISO,
} from "@/lib/date-utils";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Cute iOS-style month calendar. Tap a day to mark it studied; tracks streak. */
export function StudyCalendar() {
  const studied = useAspirantStore((s) => s.studiedDays);
  const toggleStudied = useAspirantStore((s) => s.toggleStudied);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month0, setMonth0] = useState(now.getMonth());
  const today = todayISO();
  const studiedSet = useMemo(() => new Set(studied), [studied]);
  const cells = useMemo(() => monthGrid(year, month0), [year, month0]);

  const streak = useMemo(() => {
    let n = 0;
    const d = new Date();
    // If today isn't marked yet, start counting from yesterday.
    if (!studiedSet.has(toISO(d))) d.setDate(d.getDate() - 1);
    while (studiedSet.has(toISO(d))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }, [studiedSet]);

  const step = (dir: number) => {
    let m = month0 + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth0(m);
    setYear(y);
  };

  return (
    <div className="glass glass-strong p-5" style={{ borderRadius: 24 }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-white">{monthLabel(year, month0)}</h3>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-orange-400/15 px-2.5 py-1 text-[12px] font-semibold text-orange-200 ring-1 ring-orange-300/25">
              <Flame size={13} /> {streak}
            </span>
          )}
          <button
            onClick={() => step(-1)}
            aria-label="Previous month"
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => step(1)}
            aria-label="Next month"
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-white/35">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => {
          const day = Number(c.iso.slice(-2));
          const isToday = c.iso === today;
          const isStudied = studiedSet.has(c.iso);
          return (
            <motion.button
              key={c.iso}
              onClick={() => toggleStudied(c.iso)}
              whileTap={{ scale: 0.86 }}
              transition={spring}
              aria-pressed={isStudied}
              aria-label={c.iso}
              className={cn(
                "relative grid aspect-square place-items-center rounded-full text-[13px] transition-colors",
                !c.inMonth && "opacity-30",
                isStudied
                  ? "bg-white text-black font-semibold shadow-[0_2px_10px_rgba(255,255,255,0.25)]"
                  : "text-white/80 hover:bg-white/10",
                isToday && !isStudied && "ring-1 ring-white/60"
              )}
            >
              {day}
            </motion.button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[11px] text-white/40">
        Tap a day to mark it studied
      </p>
    </div>
  );
}
