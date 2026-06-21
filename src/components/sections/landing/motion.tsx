"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const DURATION = 0.4;

// Fade-up reveal using CSS visibility — always visible, animates on view entry
export function FadeUp({
  children,
  delay = 0,
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport" | "transition"> & {
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION, delay, ease: EASE }}
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

export function Stagger({
  children,
  className,
  staggerDelay = 0.08,
  ...props
}: Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "variants" | "viewport" | "transition"> & {
  staggerDelay?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      variants={prefersReduced ? undefined : {
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
