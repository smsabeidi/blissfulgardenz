"use client";

import { motion, useReducedMotion } from "motion/react";

// The hub's "what a conversation looks like" timeline: four numbered stations
// on one drawn gold connector (the Horizon Line turned vertical). Motivation:
// storytelling; the path draws itself as you arrive at it. Reduced motion:
// the connector renders pre-drawn and the steps simply fade.

type Step = { title: string; body: string };

export function ConversationTimeline({ steps }: { steps: readonly Step[] }) {
  const reduce = useReducedMotion();
  return (
    <ol role="list" className="relative flex flex-col gap-12 sm:gap-14">
      <motion.span
        aria-hidden
        className="absolute bottom-4 left-6 top-4 w-px origin-top bg-gold opacity-30"
        initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          className="relative grid grid-cols-[3rem_1fr] gap-x-6 sm:gap-x-10"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            aria-hidden
            className="relative z-10 flex h-12 w-12 items-center justify-center justify-self-center bg-canvas font-[family-name:var(--font-display)] text-2xl text-gold-text"
          >
            {i + 1}
          </span>
          <div className="flex flex-col gap-2 pt-2">
            <h3 className="text-display-sm">{step.title}</h3>
            <p className="text-body max-w-[52ch] text-ink-muted">{step.body}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
