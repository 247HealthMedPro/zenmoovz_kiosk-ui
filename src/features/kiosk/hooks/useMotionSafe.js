"use client";

import { useReducedMotion } from "framer-motion";

export function useMotionSafe() {
  const reduced = useReducedMotion();
  return {
    reduced: !!reduced,
    fade: reduced ? { duration: 0.15 } : { duration: 0.45 },
    spring: reduced ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 28 },
  };
}
