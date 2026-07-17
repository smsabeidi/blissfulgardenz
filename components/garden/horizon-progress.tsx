"use client";

import { motion, useScroll, useSpring } from "motion/react";

// The progress role of the Horizon Line: one fixed 1px gold line directly
// under the header, width tracking scroll. Informational, so it stays active
// under reduced motion. Suppressed while the membership sticky join bar is
// visible (fixed-chrome exclusion rule) via body[data-joinbar].
export function HorizonProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-[64px] z-40 h-px origin-left bg-gold opacity-90 transition-opacity duration-300 [body[data-joinbar='1']_&]:opacity-0"
      style={{ scaleX }}
    />
  );
}
