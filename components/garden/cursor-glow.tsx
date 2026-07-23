"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// CursorGlow: a soft lantern of gold light that follows the pointer across
// a permanently dark section (the system cursor itself is untouched; the
// DESIGN.md custom-cursor ban stands). Render it inside a position:relative
// section; it listens on that parent. Mouse pointers only. Under reduced
// motion the layer simply never lights.
export function CursorGlow() {
  const layer = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parent = layer.current?.parentElement;
    if (reduce || !parent || !dot.current) return;

    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.7, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = parent.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gsap.to(dot.current, { opacity: 1, duration: 0.6, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(dot.current, { opacity: 0, duration: 0.6, ease: "power2.out" });
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={dot}
        className="absolute -left-80 -top-80 h-[40rem] w-[40rem] rounded-full opacity-0 will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, rgba(239,198,107,0.13), rgba(239,198,107,0.05) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
