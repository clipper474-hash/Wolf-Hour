import type { Transition } from "motion/react";

/** One consistent spring family across the whole app (ASMR-grade / Apple-caliber). */
export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 1,
};

/** Softer/slower variant for large surfaces (drawers, mode morph). */
export const softSpring: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 24,
  mass: 1,
};

/** Staggered entrance reveal (greeting → clock → dock). */
export const reveal = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
