"use client";

import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { BrandButton, GlassButton } from "@/components/shared/buttons";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Navbar({ onSignIn, onGetStarted }: { onSignIn: () => void; onGetStarted: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-3 sm:pt-4">
        <nav className={cn(
          "flex items-center justify-between gap-4",
          "rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl shadow-sm",
          "px-4 sm:px-6 h-14 sm:h-16"
        )}>
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground hidden sm:inline">
              Amazon PPC <span className="text-blue-600 dark:text-blue-400">Training</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5">Curriculum</a>
            <a href="#how-it-works" className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5">How It Works</a>
            <a href="#testimonials" className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5">Testimonials</a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onSignIn} className="hidden sm:inline-flex text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Sign In
            </button>
            <BrandButton size="sm" onClick={onGetStarted} className="group">
              <Sparkles className="h-3.5 w-3.5" />
              Get Started
            </BrandButton>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl px-4 sm:px-6 pt-2"
        >
          <div className="rounded-2xl border border-white/20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl p-4 shadow-lg">
            <div className="flex flex-col gap-1">
              <a href="#features" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-foreground/5 transition-colors">Curriculum</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-foreground/5 transition-colors">How It Works</a>
              <a href="#testimonials" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-foreground/5 transition-colors">Testimonials</a>
              <hr className="my-2 border-border/60" />
              <button onClick={() => { setMenuOpen(false); onSignIn(); }} className="px-4 py-3 text-sm font-medium text-muted-foreground rounded-xl hover:bg-foreground/5 transition-colors text-left">Sign In</button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
