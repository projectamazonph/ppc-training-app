"use client";

import { useState } from "react";
import { useAppStore, type Section, useProgressStats } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  GraduationCap,
  Calculator,
  BookMarked,
  Trophy,
  CheckCircle2,
  Users,
  UserCircle,
  ClipboardList,
  School,
  ScrollText,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── Nav item definition ──────────────────────────────────────
type NavItem = {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
  roles: ("student" | "instructor" | "admin" | "guest")[];
  group: "main" | "admin";
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Your training overview",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "curriculum",
    label: "Curriculum",
    icon: BookOpen,
    description: "All 4 phases & modules",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "exercises",
    label: "Exercises",
    icon: PenLine,
    description: "Practice & submit",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: GraduationCap,
    description: "Phase checkpoints",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "tools",
    label: "Tools",
    icon: Calculator,
    description: "Calculators & analyzer",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "reference",
    label: "Reference",
    icon: BookMarked,
    description: "Glossary, formulas",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "capstone",
    label: "Capstone",
    icon: Trophy,
    description: "Final project tracker",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: Download,
    description: "Templates & sheets",
    roles: ["student", "instructor", "admin", "guest"],
    group: "main",
  },
  {
    id: "myprofile",
    label: "My Profile",
    icon: UserCircle,
    description: "Your progress",
    roles: ["student"],
    group: "main",
  },
  {
    id: "mystudents",
    label: "My Students",
    icon: ClipboardList,
    description: "View & grade",
    roles: ["instructor"],
    group: "admin",
  },
  {
    id: "cohorts",
    label: "Cohorts",
    icon: School,
    description: "Training cohorts",
    roles: ["instructor", "admin"],
    group: "admin",
  },
  {
    id: "students",
    label: "Students",
    icon: Users,
    description: "Full CRUD",
    roles: ["admin"],
    group: "admin",
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: ScrollText,
    description: "All admin actions",
    roles: ["admin"],
    group: "admin",
  },
];

// ─── Sidebar component ────────────────────────────────────────
export function Sidebar({
  onNavigate,
  mobile = false,
  onClose,
}: {
  onNavigate?: () => void;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const activeSection = useAppStore((s) => s.activeSection);
  const setSection = useAppStore((s) => s.setSection);
  const user = useAppStore((s) => s.user);
  const stats = useProgressStats();
  const logout = useAppStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  const userRole = user?.role ?? "guest";
  const visibleItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );
  const mainItems = visibleItems.filter((item) => item.group === "main");
  const adminItems = visibleItems.filter((item) => item.group === "admin");

  const handleNav = (id: Section) => {
    setSection(id);
    onNavigate?.();
  };

  const userInitials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  const roleColor =
    user?.role === "admin"
      ? "from-rose-500 to-red-600"
      : user?.role === "instructor"
        ? "from-violet-500 to-purple-600"
        : user?.role === "guest"
          ? "from-stone-400 to-stone-600"
          : "from-blue-500 to-indigo-600";

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "instructor"
        ? "Instructor"
        : user?.role === "guest"
          ? "Guest"
          : "Student";

  const sidebarWidth = mobile
    ? "w-full"
    : collapsed
      ? "w-[68px]"
      : "w-64";

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground",
        sidebarWidth
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border/60 px-3 py-3">
        {!collapsed && (
          <span className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider truncate">
            Navigation
          </span>
        )}
        <div className="flex items-center gap-1">
          {mobile && (
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!mobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {/* Main section */}
        <NavGroup
          items={mainItems}
          activeId={activeSection}
          onNav={handleNav}
          stats={stats}
          collapsed={collapsed}
        />

        {/* Admin section */}
        {adminItems.length > 0 && (
          <>
            {!collapsed && (
              <div className="px-2.5 pt-4 pb-1">
                <span className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
                  Admin
                </span>
              </div>
            )}
            <NavGroup
              items={adminItems}
              activeId={activeSection}
              onNav={handleNav}
              stats={stats}
              collapsed={collapsed}
            />
          </>
        )}
      </nav>

      {/* User profile */}
      <div className="border-t border-sidebar-border/60">
        <div
          className={cn(
            "flex items-center gap-2.5",
            collapsed ? "justify-center px-2 py-3" : "px-3 py-3"
          )}
        >
          {collapsed ? (
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-white text-[10px] font-semibold shadow-sm",
                roleColor
              )}
            >
              {userInitials}
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white text-[10px] font-semibold shadow-sm",
                  roleColor
                )}
              >
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium leading-tight truncate text-sidebar-foreground">
                  {user?.name}
                </p>
                <p className="text-[10px] text-sidebar-foreground/45 leading-tight truncate">
                  {roleLabel} · v2026
                </p>
              </div>
              <button
                onClick={logout}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Nav group ────────────────────────────────────────────────
function NavGroup({
  items,
  activeId,
  onNav,
  stats,
  collapsed,
}: {
  items: NavItem[];
  activeId: Section;
  onNav: (id: Section) => void;
  stats: ReturnType<typeof useProgressStats>;
  collapsed: boolean;
}) {
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeId === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group relative flex w-full items-center rounded-lg text-left transition-all duration-150",
              collapsed ? "justify-center p-2.5" : "gap-2.5 px-2.5 py-2",
              active
                ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            {/* Active indicator */}
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-500" />
            )}

            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-md transition-colors",
                collapsed ? "h-8 w-8" : "h-7 w-7",
                active
                  ? "bg-blue-500/10 text-blue-500"
                  : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[13px] leading-tight truncate">
                  {item.label}
                </div>
                {!active && (
                  <div className="text-[10px] text-sidebar-foreground/35 leading-tight truncate mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>
            )}

            {/* Progress badges */}
            {!collapsed && item.id === "capstone" && stats.capstoneDone > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-500 border-0 text-[10px] px-1.5 font-medium"
              >
                {stats.capstoneDone}/5
              </Badge>
            )}
            {!collapsed && item.id === "quizzes" && stats.quizzesTaken > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-500 border-0 text-[10px] px-1.5 font-medium"
              >
                {stats.quizzesTaken}/4
              </Badge>
            )}
          </button>
        );
      })}
    </>
  );
}
