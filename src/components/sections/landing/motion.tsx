"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

// ── Shared easing & durations ────────────────────────────────
export const EASE = [0.16, 1, 0.3, 1] as const;
export const DURATION = 0.4;

// ── Fade-up reveal (scroll-triggered) ────────────────────────
export function FadeUp({
  children,
  delay = 0,
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> & {
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger container ────────────────────────────────────────
export function Stagger({
  children,
  className,
  staggerDelay = 0.08,
  ...props
}: Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> & {
  staggerDelay?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ staggerChildren: staggerDelay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};
