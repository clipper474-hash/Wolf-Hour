"use client";

import { useEffect, useState } from "react";

/** Tiny island: a handwritten "right now" note with the visitor's real time.
 *  SSR placeholder matches first client render — no mismatch, no CLS. */
export function DeskClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setNow(`${p(d.getHours())}:${p(d.getMinutes())}`);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="pvp-now">
      right now it&rsquo;s <b>{now ?? "--:--"}</b> — a fine time to start
    </span>
  );
}
