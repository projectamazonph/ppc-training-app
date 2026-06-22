"use client";

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
  return (
    <div className="relative">
      {/* Glow — CSS pulsing, no Framer Motion */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-blue-500/20 blur-2xl animate-pulse opacity-50" />

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
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-extrabold text-foreground">42<span className="text-sm font-normal text-muted-foreground ml-0.5">%</span></p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all" />
          </div>

          {/* Phase list - visible immediately, no animation hiding */}
          <div className="space-y-2">
            {phases.slice(0, 4).map((phase, i) => (
              <div key={phase.id} className="flex items-center gap-2.5">
                <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white text-[9px] font-bold", phaseColors[i])}>
                  {phase.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-foreground truncate">{phase.title}</span>
                    <span className="shrink-0 text-[9px] text-muted-foreground">{phase.weeks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status badges - visible immediately */}
          <div className="flex flex-wrap gap-1.5">
            {miniBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <span key={i} className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium", badge.color)}>
                  <Icon className="h-3 w-3" />
                  {badge.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
