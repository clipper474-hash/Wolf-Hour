"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/** Scroll-triggered reveal: fades + lifts + un-blurs as it enters the viewport.
 *  CSS-driven (no motion library — keeps framer out of the landing bundle).
 *  Honors reduced-motion via the media query in landing.css. Animates once. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("lp-reveal-show");
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `lp-reveal ${className}` : "lp-reveal"}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
