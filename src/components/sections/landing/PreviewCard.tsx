"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy, Calculator, GraduationCap, TrendingUp, Star } from "lucide-react";
import { phases } from "@/lib/course-data";
import { cn } from "@/lib/utils";

const phaseColors = [
  "from-blue-500 to-blue-600",
  "from-rose-500 to-red-500",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
];

const miniBadges = [
  { icon: Trophy, label: "Capstone", color: "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300" },
  { icon: Calculator, label: "Tools", color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300" },
  { icon: GraduationCap, label: "3/4 quizzes", color: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300" },
];

export function PreviewCard() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative">
      {/* Glow */}
      <motion.div
        className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-blue-500/20 blur-2xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main card */}
      <div className="relative rounded-2xl glass-strong border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/5">
          <div className="flex gap-1.5 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 text-center text-[10px] text-muted-foreground font-mono truncate">
            ppc-training.app/dashboard
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Progress header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-muted-foreground">Your Progress</div>
              <div className="text-2xl font-bold mt-0.5">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">68%</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 shrink-0"
            />
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Total Completed</span>
              <span>68%</span>
            </div>
            <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-2">
            {phases.map((p, i) => (
              <motion.div
                key={p.id}
                initial={prefersReduced ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.35 }}
                className="flex items-center gap-2.5"
              >
                <div className={cn("flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-white text-[10px] font-bold shadow-sm shrink-0", phaseColors[i])}>
                  {p.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium truncate">{p.title}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{p.weeks}</div>
                </div>
                <div className="w-14 h-1 rounded-full bg-foreground/5 overflow-hidden shrink-0">
                  <motion.div
                    className={cn("h-full bg-gradient-to-r rounded-full", phaseColors[i])}
                    initial={{ width: 0 }}
                    animate={{ width: `${[100, 80, 45, 0][i]}%` }}
                    transition={{ delay: 1.7 + i * 0.12, duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {miniBadges.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.label}
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2 + i * 0.08, type: "spring", stiffness: 300 }}
                  className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", b.color)}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {b.label}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating: TACoS */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -right-5 rounded-xl glass-strong border border-white/40 dark:border-white/10 shadow-lg p-2.5 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">TACoS</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">11.2%</div>
          </div>
        </div>
      </motion.div>

      {/* Floating: Quiz Score */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -left-4 rounded-xl glass-strong border border-white/40 dark:border-white/10 shadow-lg p-2.5 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Quiz Score</div>
            <div className="text-xs font-bold">5 / 5</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
