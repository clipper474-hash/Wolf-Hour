"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/** Scroll-triggered reveal: fades + lifts + un-blurs as it enters the viewport.
 *  Honors reduced-motion (motion respects the OS setting; the blur/offset are
 *  small enough to be calm regardless). Animates once. */
const variants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
