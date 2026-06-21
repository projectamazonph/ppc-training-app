"use client";

import { type ReactNode, type HTMLAttributes } from "react";

// CSS-only fade-up — content visible immediately, gentle animation on load
// No Framer Motion SSR opacity:0 — no blank page risk
export function FadeUp({
  children,
  delay = 0,
  className,
  ...props
}: { children: ReactNode; delay?: number; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        animation: `fade-in-up 0.5s ease-out both`,
        animationDelay: `${delay}s`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.08,
  ...props
}: { children: ReactNode; className?: string; staggerDelay?: number } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export const staggerItem = {};
export const DURATION = 0.4;
export const EASE = [0.16, 1, 0.3, 1] as const;
