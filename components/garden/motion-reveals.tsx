"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

// The differentiated reveal vocabulary (one per content kind, so sections
// stop sharing a single uniform entrance):
//   MaskRise    display headlines rise out of their own overflow mask
//   ImageUnveil photographs unveil behind a lifting curtain + settle zoom
//   Magnetic    primary CTAs lean toward the cursor, capped at 6px
// All fire once, all collapse to designed fades (or nothing) under
// prefers-reduced-motion.

export function MaskRise({
  children,
  delay = 0,
  className = "",
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // useInView observes the OUTER wrapper, which sits in normal flow and is
  // never translated or clipped, so it reliably flips true when scrolled to.
  // Observing the inner span (whileInView) deadlocks: the overflow mask hides
  // it, the observer reports it out of view, and the reveal never fires (the
  // headline / wordmark ships blank). The hook is called unconditionally to
  // respect the rules of hooks; the reduced-motion branch below just ignores it.
  const inView = useInView(ref, { once: true, amount });
  if (reduce) {
    return <span className={`block ${className}`}>{children}</span>;
  }
  return (
    <span ref={ref} className={`block overflow-hidden pb-[0.2em] -mb-[0.2em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "112%" }}
        animate={inView ? { y: "0%" } : { y: "112%" }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function ImageUnveil({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Same deadlock MaskRise documents above, and for the same reason. This used
  // to put whileInView on the element carrying the curtain, but that element is
  // clipped to `inset(0 0 100% 0)` until the reveal fires: it paints nothing,
  // the observer never sees 25% of it, the reveal never fires, and the
  // photograph ships as an empty rectangle forever. The founder portrait was
  // sitting invisible on the home page because of it.
  //
  // So the observer watches this OUTER wrapper, which is never clipped and
  // keeps its full layout height (clip-path is paint-only), and the curtain
  // lifts off `inView` instead of watching itself.
  const inView = useInView(ref, { once: true, amount: 0.25 });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={inView ? { clipPath: "inset(0 0 0% 0)" } : { clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.16 }}
          animate={inView ? { scale: 1 } : { scale: 1.16 }}
          transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Magnetic({
  children,
  strength = 0.3,
  className = "",
  style,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 240, damping: 20, mass: 0.4 });

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // DESIGN.md motion inventory: magnetic pull ≤6px, pointer devices only.
  const MAX = 6;
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * strength;
    const dy = (e.clientY - rect.top - rect.height / 2) * strength;
    x.set(Math.max(-MAX, Math.min(MAX, dx)));
    y.set(Math.max(-MAX, Math.min(MAX, dy)));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ ...style, x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
