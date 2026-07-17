"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useRef, useState } from "react";
import { useClockStore } from "@/lib/store";
import { presetById, clockFaceStyle } from "@/lib/clock-styles";
import { FlipDigit } from "./FlipDigit";

/** One digit of a swap-mode face: old glyph animates out, new animates in.
 *  Skin + animation live in globals.css (.swap-led / -lcd / -glitch / -ember). */
function SwapDigit({ value }: { value: string }) {
  const [current, setCurrent] = useState(value);
  const [prev, setPrev] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (value === current) return;
    setPrev(current);
    setCurrent(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPrev(null), 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, current]);

  return (
    <span className="swapd" aria-hidden>
      {prev !== null && <span className="old">{prev}</span>}
      <span key={current} className={prev !== null ? "new" : undefined}>
        {current}
      </span>
    </span>
  );
}

/** The giant live clock — renders the user's chosen style preset. */
export function Clock() {
  const { presetId, hour12, showSeconds } = useClockStore();
  const preset = presetById(presetId);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const style: React.CSSProperties = {
    fontFamily: preset.font,
    fontWeight: preset.weight,
    letterSpacing: preset.tracking,
    fontSize: "clamp(5rem, 16vw, 11rem)",
    lineHeight: 1,
    ...clockFaceStyle(preset),
  };
  const shimmer = preset.shimmer ? "clock-shimmer" : undefined;

  if (!now) {
    return (
      <div aria-hidden className="tabular" style={style}>
        &nbsp;
      </div>
    );
  }

  let h = now.getHours();
  if (hour12) h = h % 12 || 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const pad = (n: number) => String(n).padStart(2, "0");
  const label = `${pad(h)}:${pad(m)}${showSeconds ? ":" + pad(s) : ""}`;

  const Colon = () => <span className="px-[0.06em] opacity-60">:</span>;

  // Flip style — split-flap digits per position.
  if (preset.mode === "flip") {
    const hh = pad(h);
    const mm = pad(m);
    const ss = pad(s);
    return (
      <time aria-label={label} className={`tabular flex items-center ${shimmer ?? ""}`} style={style}>
        <FlipDigit value={hh[0]} />
        <FlipDigit value={hh[1]} />
        <Colon />
        <FlipDigit value={mm[0]} />
        <FlipDigit value={mm[1]} />
        {showSeconds && (
          <>
            <Colon />
            <FlipDigit value={ss[0]} />
            <FlipDigit value={ss[1]} />
          </>
        )}
      </time>
    );
  }

  // Swap style — per-digit change animation (LED Matrix / LCD / Glitch / Ember).
  if (preset.mode === "swap") {
    const hh = pad(h);
    const mm = pad(m);
    const ss = pad(s);
    const digits = (
      <>
        <SwapDigit value={hh[0]} />
        <SwapDigit value={hh[1]} />
        <Colon />
        <SwapDigit value={mm[0]} />
        <SwapDigit value={mm[1]} />
        {showSeconds && (
          <>
            <Colon />
            <SwapDigit value={ss[0]} />
            <SwapDigit value={ss[1]} />
          </>
        )}
      </>
    );
    // LCD gets an unlit segment "ghost" (88:88:88) beneath the lit digits —
    // same cell structure so the ghost aligns with the live digits exactly.
    if (preset.variant === "lcd") {
      const ghostCells = showSeconds ? [2, 2, 2] : [2, 2];
      return (
        <time aria-label={label} className="tabular swap-lcd relative inline-flex items-center" style={style}>
          <span aria-hidden className="lcd-ghost absolute inset-0 flex items-center">
            {ghostCells.map((count, gi) => (
              <span key={gi} className="flex items-center">
                {gi > 0 && <Colon />}
                {Array.from({ length: count }, (_, di) => (
                  <span key={di} className="swapd">8</span>
                ))}
              </span>
            ))}
          </span>
          <span className="relative flex items-center">{digits}</span>
        </time>
      );
    }
    return (
      <time aria-label={label} className={`tabular flex items-center swap-${preset.variant}`} style={style}>
        {digits}
      </time>
    );
  }

  // Rolling style — animated NumberFlow digits.
  if (preset.mode === "rolling") {
    return (
      <time aria-label={label} className={`tabular flex items-center ${shimmer ?? ""}`} style={style}>
        <NumberFlow value={h} format={{ minimumIntegerDigits: 2 }} />
        <Colon />
        <NumberFlow value={m} format={{ minimumIntegerDigits: 2 }} />
        {showSeconds && (
          <>
            <Colon />
            <NumberFlow value={s} format={{ minimumIntegerDigits: 2 }} />
          </>
        )}
      </time>
    );
  }

  // Plain style — static text (no digit animation), styled by the font.
  return (
    <time aria-label={label} className={`tabular ${shimmer ?? ""}`} style={style}>
      {label}
    </time>
  );
}
