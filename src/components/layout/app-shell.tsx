"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { useAppStore, useProgressStats } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Menu,
  Moon,
  Sun,
  RotateCcw,
  LogOut,
  User as UserIcon,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  PenLine,
  GraduationCap,
  Calculator,
  BookMarked,
  Trophy,
  Users,
  UserCircle,
  ClipboardList,
  School,
  ScrollText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { programOverview } from "@/lib/course-data";
import { useToast } from "@/hooks/use-toast";

// ─── Section metadata ─────────────────────────────────────────
const sectionLabels: Record<
  string,
  { title: string; subtitle: string; icon: React.ElementType }
> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Training overview & progress",
    icon: LayoutDashboard,
  },
  curriculum: {
    title: "Curriculum",
    subtitle: "4 phases · 10 modules",
    icon: BookOpen,
  },
  exercises: {
    title: "Exercises",
    subtitle: "Practice & submit answers",
    icon: PenLine,
  },
  quizzes: {
    title: "Quizzes",
    subtitle: "Auto-graded checkpoints",
    icon: GraduationCap,
  },
  tools: {
    title: "Tools",
    subtitle: "Calculators & analyzers",
    icon: Calculator,
  },
  reference: {
    title: "Reference",
    subtitle: "Glossary · formulas",
    icon: BookMarked,
  },
  capstone: {
    title: "Capstone",
    subtitle: "Final project deliverables",
    icon: Trophy,
  },
  students: {
    title: "Students",
    subtitle: "Admin · full CRUD",
    icon: Users,
  },
  myprofile: {
    title: "My Profile",
    subtitle: "Progress & activity",
    icon: UserCircle,
  },
  mystudents: {
    title: "My Students",
    subtitle: "Instructor · grading",
    icon: ClipboardList,
  },
  cohorts: {
    title: "Cohorts",
    subtitle: "Training cohorts",
    icon: School,
  },
  audit: {
    title: "Audit Log",
    subtitle: "Admin actions",
    icon: ScrollText,
  },
  downloads: {
    title: "Downloads",
    subtitle: "Templates & sheets",
    icon: Download,
  },
};

export function AppShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("ppc-theme") === "dark" ? "dark" : "light";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarCollapsed, setMobileSidebarCollapsed] = useState(true);
  const activeSection = useAppStore((s) => s.activeSection);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("ppc-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("ppc-theme", next);
  };

  const handleReset = () => {
    resetProgress();
    toast({
      title: "Progress reset",
      description:
        "All your saved answers, quiz results, and checklist items have been cleared.",
    });
  };

  const handleLogout = () => {
    const firstName = user?.name?.split(" ")[0] ?? "there";
    logout();
    toast({
      title: "Signed out",
      description: `Goodbye, ${firstName}! Your progress was saved locally.`,
    });
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
      ? "bg-rose-600"
      : user?.role === "instructor"
        ? "bg-violet-600"
        : user?.role === "guest"
          ? "bg-stone-500"
          : "bg-blue-600";

  const meta = sectionLabels[activeSection] ?? sectionLabels.dashboard;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* ═══ Top bar ═══ */}
      <header className="sticky top-0 z-40 h-14 border-b border-border/40 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50">
        <div className="h-full flex items-center justify-between px-3 sm:px-5 gap-2">
          {/* Left: hamburger + brand */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <a
              href="/"
              className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <span className="text-xs font-bold">P</span>
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-foreground truncate">
                PPC Training
              </span>
            </a>
            <ChevronRight className="hidden sm:block h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            <span className="hidden sm:inline text-sm text-muted-foreground truncate">
              {meta.title}
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* User menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-white text-[10px] font-semibold shadow-sm",
                        roleColor
                      )}
                    >
                      {userInitials}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-muted-foreground cursor-default pointer-events-none py-1.5">
                    Role: {user.role}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs text-muted-foreground cursor-default pointer-events-none py-1.5">
                    Signed in:{" "}
                    {new Date(user.loggedInAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-rose-600 dark:text-rose-400 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer py-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2.5" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Main split layout ═══ */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block shrink-0 border-r border-border/60">
          <div className="sticky top-14 h-[calc(100dvh-3.5rem)]">
            <Sidebar />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* ═══ Mobile overlay sidebar ═══ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[80vw] max-w-72 shadow-2xl shadow-black/20">
            <Sidebar
              mobile
              onClose={() => setMobileMenuOpen(false)}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ═══ Footer (hidden on small screens) ═══ */}
      <footer className="hidden sm:block mt-auto border-t border-border/30 bg-muted/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground/80 text-center sm:text-left">
          <p className="min-w-0 max-w-full">
            <span className="font-medium text-foreground/70 truncate">
              {programOverview.title}
            </span>
            <span className="mx-1.5 hidden sm:inline text-border/50">·</span>
            <span className="block sm:inline sm:mx-2 text-muted-foreground/60">
              v{programOverview.version} - {programOverview.duration}
            </span>
          </p>
          <p className="flex items-center gap-1.5 shrink-0 text-muted-foreground/50">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Student Workbook
          </p>
        </div>
      </footer>
    </div>
  );
}
