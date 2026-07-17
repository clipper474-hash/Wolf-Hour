"use client";

import { useEffect, useRef, useState } from "react";

/** A single split-flap digit. Animates the old→new flip on change. */
export function FlipDigit({ value }: { value: string }) {
  const [current, setCurrent] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (value === current) return;
    setPrev(current);
    setCurrent(value);
    setFlipping(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlipping(false), 620);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, current]);

  return (
    <span className="flip" aria-hidden>
      {/* static halves showing the current value */}
      <span className="half top">
        <span className="glyph">{current}</span>
      </span>
      <span className="half bottom">
        <span className="glyph">{current}</span>
      </span>
      {/* animated flaps only while changing */}
      {flipping && (
        <>
          <span className="half flap top">
            <span className="glyph">{prev}</span>
          </span>
          <span className="half flap bottom">
            <span className="glyph">{current}</span>
          </span>
        </>
      )}
    </span>
  );
}
