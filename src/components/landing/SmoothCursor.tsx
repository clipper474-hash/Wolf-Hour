"use client";

import { useEffect, useRef, useState } from "react";

/**
 * magicui-style SmoothCursor for the landing page: a visible arrow pointer
 * that spring-follows the mouse and leans into its direction of travel.
 * Fine pointers only; native cursor hidden while active (reuses the
 * data-liquid-cursor CSS flag).
 */
export function SmoothCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const on = () => setEnabled(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current!;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      const dx = tx - x;
      const dy = ty - y;
      x += dx * 0.28;
      y += dy * 0.28;
      // lean into travel direction, settle upright at rest
      const rot = Math.max(-24, Math.min(24, dx * 0.35));
      const speed = Math.min(1, Math.hypot(dx, dy) / 120);
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${1 - speed * 0.12})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.setAttribute("data-liquid-cursor", "on");
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeAttribute("data-liquid-cursor");
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ willChange: "transform" }}
    >
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
        <path
          d="M2 2 L24 13.5 L14 16.5 L10.5 27 Z"
          fill="#fff"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
