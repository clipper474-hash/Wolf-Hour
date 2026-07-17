"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useMotionTier } from "@/lib/useMotionTier";
import { usePrefsStore } from "@/lib/prefs-store";

/**
 * iOS-style liquid-glass pointer. A small glass lens follows the cursor with a
 * spring, refracting/brightening the scene beneath it (backdrop-filter) with a
 * specular rim. Grows softly over interactive targets. Hidden on touch devices
 * and in reduced-motion (native cursor returns).
 */
export function LiquidCursor() {
  const pathname = usePathname();
  const { reduced } = useMotionTier();
  const cursorPref = usePrefsStore((s) => s.cursor);
  const ref = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [finePointer, setFinePointer] = useState(false);
  // App-only: marketing/legal pages skip the rAF pointer tracking entirely.
  const enabled = finePointer && cursorPref && pathname.startsWith("/app");

  // Only on fine pointers (mouse), not touch.
  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(pointer: fine)");
    setFinePointer(mq.matches);
    const on = () => setFinePointer(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const lens = ref.current!;
    const inner = dot.current!;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let hovering = false;

    const isInteractive = (el: Element | null) =>
      !!el?.closest('button, a, [role="button"], input, [role="slider"], select, textarea');

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const over = isInteractive(e.target as Element);
      if (over !== hovering) {
        hovering = over;
        lens.style.setProperty("--lens-size", over ? "56px" : "34px");
        lens.style.setProperty("--lens-blur", over ? "3px" : "5px");
        inner.style.opacity = over ? "0" : "1";
      }
    };
    const down = () => lens.style.setProperty("--lens-scale", "0.82");
    const up = () => lens.style.setProperty("--lens-scale", "1");

    // Spring-follow so the lens trails the cursor with weight.
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      lens.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(var(--lens-scale, 1))`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    // Flag the document so CSS hides the native cursor on EVERY element (buttons,
    // inputs, etc. would otherwise re-show their own). Only while active, so
    // touch / reduced-motion users keep the real cursor.
    document.documentElement.setAttribute("data-liquid-cursor", "on");
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeAttribute("data-liquid-cursor");
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="liquid-cursor" aria-hidden>
      <div ref={dot} className="liquid-cursor__dot" />
    </div>
  );
}
