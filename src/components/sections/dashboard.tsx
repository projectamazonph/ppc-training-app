"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppStore, useProgressStats } from "@/lib/store";
import { phases, submissionChecklist } from "@/lib/course-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BrandButton } from "@/components/shared/buttons";
import { PageShell, StatCard, ContentCard, getPhaseColors } from "@/components/shared/section-shell";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  PenLine, GraduationCap, Trophy, ListChecks,
  Flame, TrendingUp, Zap, Rocket,
  ChevronRight, Award, Calendar, BookOpen,
} from "lucide-react";
import { Stagger, staggerItem } from "@/components/sections/landing/motion";

const statsCards = [
  { key: "exercises", label: "Exercises", icon: PenLine, total: 11, accent: "bg-blue-500" },
  { key: "quizzes", label: "Quizzes", icon: GraduationCap, total: 4, accent: "bg-rose-500" },
  { key: "capstone", label: "Capstone", icon: Trophy, total: 5, accent: "bg-emerald-500" },
  { key: "checklist", label: "Checklist", icon: ListChecks, total: 9, accent: "bg-violet-500" },
] as const;

function MiniRing({ pct, color, size = 36 }: { pct: number; color: string; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg width={size} height={size} className={cn("shrink-0", color)}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-15" />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700 ease-out" transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
}

function getMilestoneMessage(pct: number): string {
  if (pct >= 100) return "Program complete!";
  if (pct >= 75) return "Final stretch. Keep going.";
  if (pct >= 50) return "Halfway there. Well done.";
  if (pct >= 25) return "Great start. Momentum is building.";
  return "Every expert was once a beginner.";
}

export function DashboardSection() {
  const setSection = useAppStore((s) => s.setSection);
  const setActiveModule = useAppStore((s) => s.setActiveModule);
  const stats = useProgressStats();
  const quizResults = useAppStore((s) => s.quizResults);
  const user = useAppStore((s) => s.user);
  const [animatedOverall, setAnimatedOverall] = useState(0);

  const overall = useMemo(() => Math.min(100, Math.round(
    (stats.exercisesAttempted / 11) * 25 +
    (stats.quizzesTaken / 4) * 30 +
    (stats.capstoneDone / 5) * 30 +
    (stats.checklistDone / 9) * 15
  )), [stats]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedOverall(overall), 150);
    return () => clearTimeout(timer);
  }, [overall]);

  return (
    <PageShell>
      {/* Welcome header */}
      <ContentCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-sm text-blue-100/80 mt-1">{getMilestoneMessage(overall)}</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{animatedOverall}%</p>
              <p className="text-[10px] text-blue-200/70 uppercase tracking-wider">Overall Progress</p>
            </div>
            <MiniRing pct={animatedOverall} color="text-white" size={44} />
          </div>
        </div>
      </ContentCard>

      {/* Stats grid */}
      <Stagger staggerDelay={0.06} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((card) => {
          const count = card.key === "exercises" ? stats.exercisesAttempted
            : card.key === "quizzes" ? stats.quizzesTaken
            : card.key === "capstone" ? stats.capstoneDone
            : stats.checklistDone;
          const pct = Math.round((count / card.total) * 100);
          return (
            <motion.div key={card.key} variants={staggerItem} className="rounded-2xl border border-border/40 bg-card p-4 sm:p-5 hover:shadow-md hover:border-border/60 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">{card.label}</p>
                  <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{count}<span className="text-sm font-normal text-muted-foreground ml-0.5">/{card.total}</span></p>
                </div>
                <div className={cn("flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-white", card.accent)}>
                  <card.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-700 ease-out", pct >= 100 ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </Stagger>

      {/* Quick actions */}
      <ContentCard>
        <h3 className="text-sm sm:text-base font-bold mb-4">Quick actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Continue Learning", icon: BookOpen, section: "curriculum" as const, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
            { label: "Practice Exercises", icon: PenLine, section: "exercises" as const, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
            { label: "Take a Quiz", icon: GraduationCap, section: "quizzes" as const, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
            { label: "View Tools", icon: TrendingUp, section: "tools" as const, color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <button key={item.label} onClick={() => setSection(item.section)}
                className="flex flex-col items-center gap-2 rounded-xl p-3 sm:p-4 border border-border/40 bg-card hover:shadow-sm hover:border-border/60 transition-all duration-200 text-center"
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", item.color)}>
                  <ItemIcon className="h-4 w-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-foreground">{item.label}</span>
              </button>
            );
          })}
        </div>
      </ContentCard>

      {/* Phase progress */}
      <ContentCard>
        <h3 className="text-sm sm:text-base font-bold mb-4">Phase progress</h3>
        <div className="space-y-3">
          {phases.map((phase) => {
            const colors = getPhaseColors(phase.number);
            const phaseQuiz = quizResults[phase.checkpoint?.id ?? ""];
            return (
              <button key={phase.id} onClick={() => setActiveModule(phase.modules[0].id, phase.id)}
                className="group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border/40 bg-card hover:shadow-sm hover:border-border/60 transition-all duration-200 text-left"
              >
                <div className={cn("flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl text-white", colors.gradient)}>
                  <span className="font-bold text-sm sm:text-base">{phase.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <h4 className="font-semibold text-sm">Phase {phase.number}: {phase.title}</h4>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5" />
                      {phase.weeks}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{phase.subtitle}</p>
                </div>
                <div className="hidden sm:flex shrink-0 flex-col items-end gap-1">
                  {phaseQuiz && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      <Award className="h-3 w-3" />
                      {phaseQuiz.score}/{phaseQuiz.total}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </ContentCard>

      {/* Submission deadlines */}
      <ContentCard>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm sm:text-base font-bold">Submission deadlines</h3>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {submissionChecklist.map((item, i) => (
            <div key={i} className="rounded-xl border border-border/40 p-3 sm:p-4 bg-background/60">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">{item.phase}</p>
              </div>
              <p className="text-sm font-bold">{item.deadline}</p>
              <ul className="mt-2 space-y-1">
                {item.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 rounded-full bg-blue-500/60 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentCard>
    </PageShell>
  );
}
