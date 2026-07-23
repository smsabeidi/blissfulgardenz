"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// DepthField: a true-perspective stage for section backdrops. Layers declare
// a depth in px (negative = behind the page plane, positive = in front) and
// the stage does three quiet things at once:
//
//   scroll   the stage tips fractionally (rotateX 2.2° → -1.4°, scrubbed)
//            and each layer drifts vertically by its depth, so the scene
//            reads as a space the page moves through, not a flat image
//   pointer  layers lean away from the cursor by depth (mouse only), and
//            the stage yaws ≤1.4°, the same physics as Magnetic but for a
//            whole scene
//   depth    each layer sits at translateZ(depth × 0.25) inside a real CSS
//            perspective, with counter-scaling so nothing changes size
//
// All displacement stays inside the DESIGN.md 8-12% parallax cap (layers
// must bleed with negative insets to cover their drift). Reduced motion:
// a static photograph stack, nothing mounts.
export function DepthField({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !root.current || !stage.current) return;

    const rootEl = root.current;
    const layers = Array.from(
      rootEl.querySelectorAll<HTMLElement>("[data-depth]"),
    );

    const ctx = gsap.context(() => {
      // Depth placement: real Z with counter-scale so apparent size holds.
      layers.forEach((el) => {
        const depth = parseFloat(el.dataset.depth || "0");
        const z = depth * 0.25;
        gsap.set(el, { z, scale: 1 + -z / 1400, transformOrigin: "50% 50%" });
      });

      // Scroll: the stage tips as it passes, layers drift by depth.
      gsap.fromTo(
        stage.current,
        { rotateX: 2.2 },
        {
          rotateX: -1.4,
          ease: "none",
          scrollTrigger: {
            trigger: rootEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      layers.forEach((el) => {
        const depth = parseFloat(el.dataset.depth || "0");
        gsap.fromTo(
          el,
          { y: depth * 0.4 },
          {
            y: depth * -0.4,
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Pointer: the scene leans, gently, mouse pointers only.
      const yaw = gsap.quickTo(stage.current, "rotationY", { duration: 1.0, ease: "power3" });
      const xTos = layers.map((el) => {
        const depth = parseFloat(el.dataset.depth || "0");
        const to = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" });
        return (nx: number) => to(gsap.utils.clamp(-18, 18, nx * depth * 0.3));
      });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const rect = rootEl.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        yaw(nx * 1.4);
        xTos.forEach((to) => to(nx));
      };
      const onLeave = () => {
        yaw(0);
        xTos.forEach((to) => to(0));
      };
      rootEl.addEventListener("pointermove", onMove);
      rootEl.addEventListener("pointerleave", onLeave);
      return () => {
        rootEl.removeEventListener("pointermove", onMove);
        rootEl.removeEventListener("pointerleave", onLeave);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={className} style={{ perspective: "1400px" }}>
      <div ref={stage} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}

// A DepthField layer. Bleed it (negative insets) by at least the drift its
// depth produces, or edges will show at the extremes of the scrub.
export function DepthLayer({
  depth,
  children,
  className = "",
}: {
  depth: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-depth={depth} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
