"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppStore, useProgressStats } from "@/lib/store";
import { phases, submissionChecklist } from "@/lib/course-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BrandButton } from "@/components/shared/buttons";
import {
  PageShell,
  StatCard,
  ContentCard,
  getPhaseColors,
} from "@/components/shared/section-shell";
import { cn } from "@/lib/utils";
import {
  PenLine,
  GraduationCap,
  Trophy,
  ListChecks,
  Flame,
  TrendingUp,
  Zap,
  Rocket,
  AlertTriangle,
  ChevronRight,
  Award,
  Calendar,
  BookOpen,
} from "lucide-react";

// ─── Stat card configuration ──────────────────────────────────
const statsCards = [
  {
    key: "exercises",
    label: "Exercises",
    icon: PenLine,
    total: 11,
    accent: "from-blue-500 to-blue-600",
  },
  {
    key: "quizzes",
    label: "Quizzes",
    icon: GraduationCap,
    total: 4,
    accent: "from-rose-500 to-pink-600",
  },
  {
    key: "capstone",
    label: "Capstone",
    icon: Trophy,
    total: 5,
    accent: "from-emerald-500 to-teal-600",
  },
  {
    key: "checklist",
    label: "Checklist",
    icon: ListChecks,
    total: 9,
    accent: "from-violet-500 to-purple-600",
  },
] as const;

// ─── Mini circular progress ring ──────────────────────────────
function MiniRing({
  pct,
  color,
  size = 36,
}: {
  pct: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} className={cn("shrink-0", color)}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="opacity-15"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function getMilestoneMessage(pct: number): string {
  if (pct >= 100) return "Program complete";
  if (pct >= 75) return "Final stretch";
  if (pct >= 50) return "Halfway there";
  if (pct >= 25) return "Great start";
  return "Every expert was once a beginner";
}

function getStreakMessage(pct: number): { text: string; icon: typeof Flame } {
  if (pct >= 75) return { text: "On fire", icon: Flame };
  if (pct >= 50) return { text: "Building momentum", icon: TrendingUp };
  if (pct >= 25) return { text: "Making progress", icon: Zap };
  return { text: "Ready to start", icon: Rocket };
}

export function DashboardSection() {
  const setSection = useAppStore((s) => s.setSection);
  const setActiveModule = useAppStore((s) => s.setActiveModule);
  const stats = useProgressStats();
  const quizResults = useAppStore((s) => s.quizResults);
  const user = useAppStore((s) => s.user);

  const [animatedOverall, setAnimatedOverall] = useState(0);
  const overall = useMemo(
    () =>
      Math.min(
        100,
        Math.round(
          (stats.exercisesAttempted / 11) * 25 +
            (stats.quizzesTaken / 4) * 30 +
            (stats.capstoneDone / 5) * 30 +
            (stats.checklistDone / 9) * 15
        )
      ),
    [stats]
  );

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedOverall(overall), 150);
    return () => clearTimeout(timer);
  }, [overall]);

  const streak = getStreakMessage(overall);
  const StreakIcon = streak.icon;

  return (
    <PageShell>
      {/* ── Welcome header ── */}
      <ContentCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-sm text-blue-100/80 mt-1">
              {getMilestoneMessage(overall)} ·{" "}
              <span className="inline-flex items-center gap-1">
                <StreakIcon className="h-3.5 w-3.5" />
                {streak.text}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            <div className="text-right">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                {animatedOverall}%
              </p>
              <p className="text-[10px] text-blue-200/60 uppercase tracking-wider">
                Overall
              </p>
            </div>
            <div className="relative">
              <MiniRing pct={animatedOverall} color="text-white" size={56} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white/80" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative px-5 sm:px-6 pb-5">
          <Progress
            value={animatedOverall}
            className="h-2 bg-white/10"
          />
        </div>
      </ContentCard>

      {/* ── Quick stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          const stat = (() => {
            switch (card.key) {
              case "exercises":
                return {
                  count: stats.exercisesAttempted,
                  pct: Math.round((stats.exercisesAttempted / card.total) * 100),
                };
              case "quizzes":
                return {
                  count: stats.quizzesTaken,
                  pct: Math.round((stats.quizzesTaken / card.total) * 100),
                };
              case "capstone":
                return {
                  count: stats.capstoneDone,
                  pct: Math.round((stats.capstoneDone / card.total) * 100),
                };
              case "checklist":
                return {
                  count: stats.checklistDone,
                  pct: Math.round((stats.checklistDone / card.total) * 100),
                };
            }
          })();

          return (
            <ContentCard
              key={card.key}
              hoverable
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight">
                    {stat?.count}/{card.total}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                    card.accent
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={stat?.pct ?? 0} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {stat?.pct}% complete
                </p>
              </div>
            </ContentCard>
          );
        })}
      </div>

      {/* ── Quick actions ── */}
      <ContentCard>
        <h3 className="text-sm sm:text-base font-bold mb-3">Quick actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            {
              label: "Continue curriculum",
              action: () => setSection("curriculum"),
              icon: BookOpen,
              color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            },
            {
              label: "Practice exercises",
              action: () => setSection("exercises"),
              icon: PenLine,
              color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            },
            {
              label: "Take a quiz",
              action: () => setSection("quizzes"),
              icon: GraduationCap,
              color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Use tools",
              action: () => setSection("tools"),
              icon: Zap,
              color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
            },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl p-3 sm:p-4 border border-border/40",
                  "transition-all duration-200 hover:shadow-sm hover:border-border/60",
                  "bg-card text-center"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    item.color
                  )}
                >
                  <ItemIcon className="h-4 w-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-foreground">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </ContentCard>

      {/* ── Phase progress ── */}
      <ContentCard>
        <h3 className="text-sm sm:text-base font-bold mb-4">Phase progress</h3>
        <div className="space-y-3">
          {phases.map((phase) => {
            const colors = getPhaseColors(phase.number);
            const phaseQuiz = quizResults[phase.checkpoint?.id ?? ""];
            const exercisesDone = phase.modules.reduce(
              (acc, m) => acc + (m.exercises?.length ?? 0),
              0
            );

            return (
              <button
                key={phase.id}
                onClick={() => {
                  setActiveModule(phase.modules[0].id, phase.id);
                }}
                className="group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border/40 bg-card hover:shadow-sm hover:border-border/60 transition-all duration-200 text-left"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                    phase.color
                  )}
                >
                  <span className="font-bold text-sm sm:text-base">
                    {phase.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <h4 className="font-semibold text-sm">
                      Phase {phase.number}: {phase.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5" />
                      {phase.weeks}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {phase.subtitle}
                  </p>
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

      {/* ── Submission deadlines ── */}
      <ContentCard>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-rose-500" />
          <h3 className="text-sm sm:text-base font-bold">Submission deadlines</h3>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {submissionChecklist.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/40 p-3 sm:p-4 bg-background/60"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                  {item.phase}
                </p>
              </div>
              <p className="text-sm font-bold">{item.deadline}</p>
              <ul className="mt-2 space-y-1">
                {item.items.map((it, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
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
