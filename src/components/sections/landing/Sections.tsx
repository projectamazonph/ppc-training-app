"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import {
  Sparkles, ArrowRight, Zap, Heart, CheckCircle2, Play, Quote,
  Star, ChevronRight, Quote as QuoteIcon,
} from "lucide-react";
import { BrandButton, GlassButton } from "@/components/shared/buttons";
import { cn } from "@/lib/utils";
import { stats, features, howItWorks, testimonials } from "./data";
import { FadeUp, Stagger, staggerItem, DURATION, EASE } from "./motion";

type scrollTo = (id: string) => void;

// ── Hero ──────────────────────────────────────────────────────
export function Hero({
  onSignup,
  onGuest,
  Preview,
}: {
  onSignup: () => void;
  onGuest: () => void;
  Preview: React.ReactNode;
}) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4]);
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative px-4 sm:px-6 pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
      <motion.div
        style={prefersReduced ? undefined : { y: heroY, opacity: heroOpacity }}
        className="mx-auto max-w-6xl"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="max-w-xl mx-auto lg:mx-0">
            <FadeUp delay={0.1}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 px-3.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                Version 2026 &middot; No Seller Central access required
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-foreground">
                Master{" "}
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Amazon PPC
                </span>{" "}
                in 12 Weeks.
              </h1>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                A complete student workbook reimagined as an interactive learning platform.
                Read modules, practice with live tools, and build a real capstone strategy.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <BrandButton size="lg" onClick={onSignup} className="group w-full sm:w-auto">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </BrandButton>
                <GlassButton size="lg" onClick={onGuest} className="w-full sm:w-auto">
                  <Play className="h-4 w-4" />
                  Try as Guest
                </GlassButton>
              </div>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex -space-x-1.5">
                  {["bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-violet-500"].map((c, i) => (
                    <div key={i} className={cn("h-6 w-6 rounded-full border-2 border-background", c)} />
                  ))}
                </div>
                <span>Trusted by students and instructors</span>
              </div>
            </FadeUp>
          </div>

          {/* Preview */}
          <FadeUp delay={0.3} className="hidden sm:block">
            {Preview}
          </FadeUp>
        </div>
      </motion.div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────
export function Stats() {
  return (
    <section className="relative px-4 sm:px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="rounded-2xl border border-foreground/5 bg-white/50 dark:bg-stone-900/30 backdrop-blur-sm p-6 sm:p-8">
            <Stagger staggerDelay={0.08} className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    variants={staggerItem}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <Icon className="h-4 w-4 text-blue-500/60" />
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {s.value}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      {s.label}
                    </div>
                  </motion.div>
                );
              })}
            </Stagger>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────
export function Features() {
  return (
    <section id="features" className="relative px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 px-3.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Everything in One Place
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Built for serious learners.
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Loved by instructors.
            </span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Every piece of the workbook, turned into interactive tools you can actually use.
          </p>
        </FadeUp>

        <Stagger staggerDelay={0.1} className="mt-14 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-foreground/5 bg-white/60 dark:bg-stone-900/30 backdrop-blur-sm p-6 hover:border-foreground/10 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300"
              >
                <div className={cn("absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl", f.glow)} />
                <div className={cn("relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md", f.gradient)}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-[15px]">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                <ChevronRight className="absolute bottom-5 right-5 h-4 w-4 text-foreground/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────
export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 sm:px-6 py-20 sm:py-28 bg-gradient-to-b from-transparent via-blue-50/40 dark:via-blue-950/10 to-transparent">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 mb-4">
            <Zap className="h-3.5 w-3.5" />
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How It Works</h2>
          <p className="mt-4 text-base text-muted-foreground">
            From sign up to capstone — follow 4 simple steps.
          </p>
        </FadeUp>

        <Stagger staggerDelay={0.12} className="mt-14 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <motion.div key={step.step} variants={staggerItem} className="relative text-center group">
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-foreground/10 to-foreground/5">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/10" />
                  </div>
                )}

                <div className="relative inline-flex">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-stone-800 dark:to-stone-900 border border-foreground/5 shadow-sm group-hover:shadow-md group-hover:border-foreground/10 transition-all duration-300">
                    <StepIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white text-[10px] font-bold shadow-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-[15px]">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────
export function Testimonials() {
  return (
    <section id="testimonials" className="relative px-4 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/40 px-3.5 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 mb-4">
            <Heart className="h-3.5 w-3.5" />
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">What Our Students Say</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Real experiences from those who have completed the program.
          </p>
        </FadeUp>

        <Stagger staggerDelay={0.1} className="mt-14 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              className="relative rounded-2xl border border-foreground/5 bg-white/60 dark:bg-stone-900/30 backdrop-blur-sm p-6 hover:border-foreground/10 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300"
            >
              <QuoteIcon className="h-8 w-8 text-blue-500/15 mb-3" />
              <p className="text-sm leading-relaxed text-foreground/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────
export function CTA({
  onSignup,
  onGuest,
}: {
  onSignup: () => void;
  onGuest: () => void;
}) {
  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.08),transparent_50%)]" />

          <div className="relative px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 text-center">
            <FadeUp delay={0.1}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-xs font-medium text-white/90 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                From Workbook to Interactive Platform
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ready to Take the<br className="hidden sm:block" /> First Step?
              </h2>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="mt-4 text-base sm:text-lg text-blue-100/80 max-w-xl mx-auto leading-relaxed">
                Join the students who have already started their Amazon PPC journey.
                No upfront cost — try it first, trust yourself.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <BrandButton
                  size="lg"
                  variant="accent"
                  onClick={onSignup}
                  className="group w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10"
                >
                  Start Now — Free
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </BrandButton>
                <GlassButton size="lg" onClick={onGuest} className="w-full sm:w-auto border-white/25 text-white hover:bg-white/15 hover:text-white">
                  <Play className="h-4 w-4" />
                  Try as Guest
                </GlassButton>
              </div>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-blue-200/60">
                {["No credit card", "Free to start", "Cancel anytime"].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="relative px-4 sm:px-6 py-10 border-t border-foreground/5">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-3 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <span className="text-sm font-bold tracking-tight">Amazon PPC Training</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed max-w-xs">
              A complete student workbook turned into an interactive learning platform for Amazon PPC advertising.
            </p>
          </div>

          {/* Program */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Program</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Curriculum</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Information</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="font-semibold text-foreground">Amazon PPC Manager Training Program</span></li>
              <li>Version 2026</li>
              <li>8-12 weeks</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Amazon PPC Training Program. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Built with motion &middot; Student Workbook
          </p>
        </div>
      </div>
    </footer>
  );
}
