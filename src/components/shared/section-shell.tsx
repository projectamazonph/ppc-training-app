"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Page shell: wraps every section page ─────────────────────
export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6 sm:space-y-8", className)}>{children}</div>
  );
}

// ─── Stat card: reusable metric card ──────────────────────────
export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border/40 bg-card p-4 sm:p-5",
        "transition-all duration-200 hover:shadow-md hover:border-border/60",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
              accent || "from-primary-500 to-primary-600"
            )}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "font-medium",
              trend.positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
          <span className="text-muted-foreground">this week</span>
        </div>
      )}
    </div>
  );
}

// ─── Content card: wrapper with consistent styling ────────────
export function ContentCard({
  children,
  className,
  noPadding = false,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/40 bg-card overflow-hidden",
        hoverable &&
          "transition-all duration-200 hover:shadow-md hover:border-border/60",
        !noPadding && "p-4 sm:p-5 lg:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Section divider with optional label ──────────────────────
export function SectionDivider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-border via-border to-transparent" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-border/60 to-transparent",
        className
      )}
    />
  );
}

// ─── Phase color tokens (centralized) ─────────────────────────
export const PHASE_COLORS: Record<
  number,
  {
    gradient: string;
    accent: string;
    accentBg: string;
    light: string;
    badge: string;
    iconBg: string;
    ring: string;
  }
> = {
  1: {
    gradient: "from-blue-600 to-indigo-600",
    accent: "text-blue-600 dark:text-blue-400",
    accentBg: "bg-blue-500/10 dark:bg-blue-500/15",
    light: "bg-blue-50 dark:bg-blue-950/30",
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    ring: "ring-blue-200 dark:ring-blue-800",
  },
  2: {
    gradient: "from-violet-600 to-purple-600",
    accent: "text-violet-600 dark:text-violet-400",
    accentBg: "bg-violet-500/10 dark:bg-violet-500/15",
    light: "bg-violet-50 dark:bg-violet-950/30",
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    ring: "ring-violet-200 dark:ring-violet-800",
  },
  3: {
    gradient: "from-amber-500 to-orange-500",
    accent: "text-amber-600 dark:text-amber-400",
    accentBg: "bg-amber-500/10 dark:bg-amber-500/15",
    light: "bg-amber-50 dark:bg-amber-950/30",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    ring: "ring-amber-200 dark:ring-amber-800",
  },
  4: {
    gradient: "from-emerald-500 to-teal-500",
    accent: "text-emerald-600 dark:text-emerald-400",
    accentBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    light: "bg-emerald-50 dark:bg-emerald-950/30",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    ring: "ring-emerald-200 dark:ring-emerald-800",
  },
  5: {
    gradient: "from-rose-500 to-pink-500",
    accent: "text-rose-600 dark:text-rose-400",
    accentBg: "bg-rose-500/10 dark:bg-rose-500/15",
    light: "bg-rose-50 dark:bg-rose-950/30",
    badge:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    ring: "ring-rose-200 dark:ring-rose-800",
  },
};

export function getPhaseColors(phase: number) {
  return PHASE_COLORS[phase] ?? PHASE_COLORS[1];
}
