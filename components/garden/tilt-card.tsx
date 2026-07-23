"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

// TiltCard: cards answer the cursor the way the primary CTAs already do
// (Magnetic), but in rotation instead of translation: ≤3.5° of tilt on the
// Magnetic spring curve, plus a faint gold sheen that follows the pointer
// across the surface. Mouse pointers only; touch and reduced motion get the
// plain card.
export function TiltCard({
  children,
  className = "",
  max = 3.5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);
  const sheenOpacity = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20, mass: 0.5 });
  const sSheen = useSpring(sheenOpacity, { stiffness: 160, damping: 24 });
  const sheen = useMotionTemplate`radial-gradient(560px circle at ${sheenX}% ${sheenY}%, color-mix(in srgb, var(--gold) 9%, transparent), transparent 65%)`;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(ny * -2 * max);
    ry.set(nx * 2 * max);
    sheenX.set((nx + 0.5) * 100);
    sheenY.set((ny + 0.5) * 100);
    sheenOpacity.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    sheenOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2rem]"
        style={{ background: sheen, opacity: sSheen }}
      />
    </motion.div>
  );
}
