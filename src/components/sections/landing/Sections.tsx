"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles, ArrowRight, CheckCircle2, Play, Quote, Star, ChevronRight,
  BookOpen, Target, BarChart3, Users, Zap, Shield, GraduationCap,
} from "lucide-react";
import { BrandButton, GlassButton } from "@/components/shared/buttons";
import { cn } from "@/lib/utils";
import { stats, features, howItWorks, testimonials } from "./data";
import { FadeUp, Stagger, staggerItem } from "./motion";

export function Hero({ onSignup, onGuest, Preview }: {
  onSignup: () => void;
  onGuest: () => void;
  Preview: React.ReactNode;
}) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4]);
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
      <motion.div
        style={prefersReduced ? undefined : { y: heroY, opacity: heroOpacity }}
        className="mx-auto max-w-6xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
          {/* Left column — copy */}
          <div className="flex-1 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <FadeUp delay={0.1}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 px-3.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 mb-5">
                <Sparkles className="h-3.5 w-3.5" />
                Amazon PPC Manager Training Program - v2026
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground">
                Master{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Amazon PPC
                </span>
                <br />
                in 12 Weeks.
              </h1>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                A complete student workbook reimagined as an interactive platform. Read modules, practice with live tools, and build a real capstone strategy.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
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
          </div>

          {/* Right column — preview card */}
          <FadeUp delay={0.25} className="hidden lg:block flex-1">
            {Preview}
          </FadeUp>
        </div>
      </motion.div>
    </section>
  );
}

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
                  <motion.div key={s.label} variants={staggerItem} className="text-center">
                    <div className="flex items-center justify-center mx-auto h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground">{s.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{s.label}</p>
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

export function Features() {
  return (
    <section id="features" className="relative px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Everything you need to succeed
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Four phases. Ten modules. Zero fluff.
            </p>
          </div>
        </FadeUp>

        <Stagger staggerDelay={0.06} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="group rounded-2xl border border-foreground/5 bg-card p-5 sm:p-6 hover:shadow-md hover:border-foreground/10 transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 sm:px-6 py-16 sm:py-24 bg-muted/40 dark:bg-muted/10">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">How it works</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              From zero to campaign-ready in four structured phases.
            </p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {howItWorks.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeUp key={step.title} delay={i * 0.1}>
                <div className="relative rounded-2xl border border-foreground/5 bg-card p-5 sm:p-6 text-center">
                  <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-2xl bg-blue-600 text-white shadow-md mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">What students say</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Real feedback from real learners.
            </p>
          </div>
        </FadeUp>

        <Stagger staggerDelay={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={staggerItem} className="rounded-2xl border border-foreground/5 bg-card p-5 sm:p-6">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={cn("h-3.5 w-3.5", j < t.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20")} />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function CTA({ onSignup, onGuest }: { onSignup: () => void; onGuest: () => void }) {
  return (
    <section className="relative px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Ready to take the first step?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-blue-100/80 max-w-xl mx-auto leading-relaxed">
                Join students who have already started their Amazon PPC journey. No upfront cost.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <BrandButton size="lg" variant="accent" onClick={onSignup} className="group w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10">
                  Start Now - Free
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </BrandButton>
                <GlassButton size="lg" onClick={onGuest} className="w-full sm:w-auto border-white/25 text-white hover:bg-white/15 hover:text-white">
                  <Play className="h-4 w-4" />
                  Try as Guest
                </GlassButton>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-blue-200/60">
                {["No credit card", "Free to start", "Cancel anytime"].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative px-4 sm:px-6 py-10 border-t border-foreground/5">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-3 mb-10">
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
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Program</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Curriculum</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
            </ul>
          </div>
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
            Student Workbook
          </p>
        </div>
      </div>
    </footer>
  );
}
