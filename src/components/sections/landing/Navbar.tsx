"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandButton } from "@/components/shared/buttons";
import { cn } from "@/lib/utils";

type NavbarProps = {
  onSignIn: () => void;
  onGetStarted: () => void;
};

const links = [
  { label: "Curriculum", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar({ onSignIn, onGetStarted }: NavbarProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.header
      initial={prefersReduced ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30 glass border-b border-white/30 dark:border-white/5"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 min-w-0 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20">
            <Flame className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Amazon PPC
            <span className="hidden sm:inline text-blue-600 dark:text-blue-400"> Training</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 shrink-0">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignIn}
            className="hidden sm:inline-flex text-[13px] font-medium"
          >
            Sign In
          </Button>
          <BrandButton size="sm" onClick={onGetStarted}>
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </BrandButton>
        </div>
      </div>
    </motion.header>
  );
}
