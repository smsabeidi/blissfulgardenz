"use client";

import { motion, useReducedMotion } from "motion/react";
import { illustrativeStories, storiesLabel } from "@/content/library";

// The Blossom Wall: stories drift gently like petals; motion pauses on hover
// and disappears entirely under reduced motion. Labeled illustrative at the
// section level (design ruling D21); cards stay clean.

export function BlossomWall() {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-10">
      <p className="text-meta text-sage">{storiesLabel}</p>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {illustrativeStories.map((story, i) => {
          const drift = reduce ? 0 : (i % 3) - 1;
          return (
            <motion.li
              key={story.name}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <motion.figure
                animate={
                  reduce
                    ? undefined
                    : { y: [drift * 3, drift * -3, drift * 3] }
                }
                transition={
                  reduce
                    ? undefined
                    : { duration: 9 + i, repeat: Infinity, ease: "easeInOut" }
                }
                whileHover={{ y: 0 }}
                className="flex h-full flex-col justify-between gap-6 rounded-[2rem] bg-raised p-1.5 ring-1 ring-hairline"
                style={{ boxShadow: "0 18px 50px var(--shadow-tint)" }}
              >
                <div className="flex h-full flex-col justify-between gap-6 rounded-[calc(2rem-6px)] bg-surface p-7">
                  <blockquote className="font-[family-name:var(--font-display)] text-xl italic leading-snug">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--terracotta)_16%,transparent)] font-[family-name:var(--font-display)] text-sm text-terracotta"
                    >
                      {story.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium">{story.name}</span>
                      <span className="block text-[13px] text-ink-muted">{story.stage}</span>
                    </span>
                  </figcaption>
                </div>
              </motion.figure>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
