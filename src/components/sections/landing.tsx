"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppStore, type User } from "@/lib/store";
import { programOverview, phases } from "@/lib/course-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BrandButton, GlassButton } from "@/components/shared/buttons";
import {
  Flame,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Trophy,
  Calculator,
  BookOpen,
  PenLine,
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
  Zap,
  ShieldCheck,
  Star,
  BarChart3,
  Layers,
  CheckCircle2,
  Play,
  Users,
  Award,
  Clock,
  Quote,
  Heart,
} from "lucide-react";

// =============================================================
// Constants
// =============================================================

const stats = [
  { value: "4", label: "Phase", icon: Layers },
  { value: "10", label: "Module", icon: BookOpen },
  { value: "11", label: "Pagsasanay", icon: PenLine },
  { value: "12", label: "Linggo", icon: Clock },
];

const features = [
  {
    icon: BookOpen,
    title: "Structured na kurikulum",
    description:
      "10 modules sa 4 phases — mula sa Amazon fundamentals hanggang sa kumpletong capstone strategy.",
    gradient: "from-blue-500 to-blue-600",
    bgGlow: "bg-blue-500/10",
  },
  {
    icon: PenLine,
    title: "Interactive na pagsasanay",
    description:
      "Open-ended, calculation, at decision-based na pagsasanay na may live feedback.",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/10",
  },
  {
    icon: Calculator,
    title: "Live na PPC tools",
    description:
      "Metrics calculator, search term analyzer, at 4-layer na campaign builder.",
    gradient: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/10",
  },
  {
    icon: Trophy,
    title: "Capstone project",
    description:
      "Gumawa ng kumpletong PPC strategy at i-present ito na parang ang instruktor mo ay ang kliyente.",
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/10",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Mag-sign up ng libre",
    description: "Gumawa ng account sa loob ng ilang segundo. Walang credit card na kailangan.",
    icon: UserIcon,
  },
  {
    step: "02",
    title: "Kunin ang kurikulum",
    description: "10 modules sa 4 phases — mula sa fundamentals hanggang sa advanced strategy.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "Magsanay gamit ang tools",
    description: "Gamit ang live na PPC tools, search term analyzer, at campaign builder.",
    icon: Target,
  },
  {
    step: "04",
    title: "Tapusin ang capstone",
    description: "Gumawa ng totoong PPC strategy at i-present ito na parang ang instruktor mo ay kliyente.",
    icon: Award,
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "Amazon Seller",
    quote:
      "Ang structured na kurikulum ay nagbago ng paraan ko sa pag-manage ng PPC campaigns. Mas confident na ako ngayon.",
    rating: 5,
  },
  {
    name: "Carlos Reyes",
    role: "E-commerce Manager",
    quote:
      "Ang live na tools ang pinaka-nakatulong. Hindi lang theory — talagang nagagawa mo agad ang natutunan.",
    rating: 5,
  },
  {
    name: "Ana Lim",
    role: "Virtual Assistant",
    quote:
      "Mula sa zero knowledge, nakapag-launch na ako ng sariling PPC campaign pagkatapos ng 12 linggo. Sulit na sulit!",
    rating: 5,
  },
];

const floatingIcons = [
  { Icon: TrendingUp, x: "8%", y: "18%", delay: 0, duration: 7 },
  { Icon: Target, x: "85%", y: "12%", delay: 1.2, duration: 8 },
  { Icon: Calculator, x: "92%", y: "65%", delay: 0.6, duration: 9 },
  { Icon: Star, x: "5%", y: "70%", delay: 1.8, duration: 7.5 },
  { Icon: BarChart3, x: "75%", y: "85%", delay: 0.3, duration: 8.5 },
  { Icon: Layers, x: "15%", y: "45%", delay: 2.1, duration: 9.5 },
  { Icon: Zap, x: "60%", y: "8%", delay: 1.5, duration: 7 },
  { Icon: ShieldCheck, x: "40%", y: "92%", delay: 0.9, duration: 8 },
];

// =============================================================
// Main landing/login page
// =============================================================

export function LandingPage() {
  const login = useAppStore((s) => s.login);
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isMobile = useIsMobile();

  // Parallax mouse tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4]);

  // Spring for smooth parallax
  const springConfig = { stiffness: 120, damping: 30 };
  const smoothMouseX = useSpring(0, springConfig);
  const smoothMouseY = useSpring(0, springConfig);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x, y });
      smoothMouseX.set(x);
      smoothMouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [smoothMouseX, smoothMouseY, isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Kulang na field",
        description: "Kailangan ang email at password.",
        variant: "destructive",
      });
      return;
    }
    if (authMode === "signup" && !name.trim()) {
      toast({
        title: "Kailangan ang pangalan",
        description: "Pakilagay ang iyong pangalan upang gumawa ng account.",
        variant: "destructive",
      });
      return;
    }
    if (authMode === "signup" && password.length < 6) {
      toast({
        title: "Masyadong maikli ang password",
        description: "Dapat hindi bababa sa 6 na characters ang password.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload =
        authMode === "login"
          ? { email: email.trim(), password }
          : { name: name.trim(), email: email.trim(), password, cohort: "Spring 2026" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      const dbRole = (data.user.role ?? "STUDENT").toLowerCase() as User["role"];
      const dbStatus = data.user.status as User["status"];

      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: dbRole,
        status: dbStatus,
        cohort: data.user.cohort ?? null,
        currentPhase: data.user.currentPhase ?? 1,
        targetAcos: data.user.targetAcos ?? 30,
        loggedInAt: Date.now(),
        serverProgress: data.progress,
      };

      login(user);

      const firstName = user.name.split(" ")[0];
      toast({
        title:
          authMode === "login"
            ? `Maligayang pagbabalik, ${firstName}!`
            : `Maligayang pagdating, ${firstName}!`,
        description:
          authMode === "login"
            ? user.status === "PAUSED"
              ? "Nakapatigil ang iyong account — malayang mag-browse ng material."
              : `Naka-sign in ka bilang ${dbRole}. ${user.cohort ? `Cohort: ${user.cohort}.` : ""}`
            : "Nagsisimula na ang iyong training journey. Magsimula sa Phase 1.",
      });
    } catch (err: any) {
      toast({
        title: authMode === "login" ? "Bigo ang sign in" : "Bigo ang sign up",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    const user: User = {
      name: "Guest Student",
      email: "guest@ppc-training.local",
      role: "guest",
      loggedInAt: Date.now(),
    };
    login(user);
    toast({
      title: "Tinitingnan bilang guest",
      description: "Ang iyong progreso ay maiimbak sa lokal na device.",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-background"
    >
      {/* ============================================================ */}
      {/* Ambient background — subtle gradient mesh                     */}
      {/* ============================================================ */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Base wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900" />

        {/* Soft gradient orbs */}
        <motion.div
          className="absolute -top-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[100px]"
          animate={{ x: smoothMouseX.get() * 30, y: smoothMouseY.get() * 30 }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
        />
        <motion.div
          className="absolute top-1/4 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-400/15 dark:bg-amber-500/8 blur-[100px]"
          animate={{
            x: smoothMouseX.get() * -20,
            y: smoothMouseY.get() * -20,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-400/15 dark:bg-indigo-500/8 blur-[100px]"
          animate={{ x: smoothMouseX.get() * 15, y: smoothMouseY.get() * 15 }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            color: "rgb(100, 116, 139)",
          }}
        />

        {/* Floating PPC icons */}
        {floatingIcons.map(({ Icon, x, y, delay, duration }, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:block"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.25, 0.25, 0],
              scale: [0, 1, 1, 0.5],
              y: [0, -16, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="rounded-2xl border border-white/50 dark:border-white/5 bg-white/30 dark:bg-stone-900/30 backdrop-blur-sm p-3 shadow-sm">
              <Icon className="h-5 w-5 text-blue-500/70 dark:text-blue-400/50" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* Top nav                                                      */}
      {/* ============================================================ */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-30 glass border-b border-white/30 dark:border-white/5"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <motion.div
            className="flex items-center gap-2.5 min-w-0"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="min-w-0 leading-tight">
              <span className="text-sm font-bold tracking-tight">
                Amazon PPC
              </span>
              <span className="hidden sm:inline text-sm font-bold text-blue-600 dark:text-blue-400">
                {" "}Training
              </span>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-0.5 shrink-0 overflow-x-auto">
            {[
              { label: "Kurikulum", href: "#features" },
              { label: "Paano Gumagana", href: "#how-it-works" },
              { label: "Testimonya", href: "#testimonials" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(true);
                setAuthMode("login");
                setTimeout(() => {
                  document
                    .getElementById("auth-form")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
              }}
              className="hidden sm:inline-flex text-[13px] font-medium"
            >
              Mag-sign in
            </Button>
            <BrandButton
              size="sm"
              onClick={() => {
                setShowForm(true);
                setAuthMode("signup");
                setTimeout(() => {
                  document
                    .getElementById("auth-form")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
              }}
            >
              <span className="hidden sm:inline">Manguna</span>
              <span className="sm:hidden">Magsimula</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </BrandButton>
          </div>
        </div>
      </motion.header>

      {/* ============================================================ */}
      {/* Hero                                                         */}
      {/* ============================================================ */}
      <section className="relative px-4 sm:px-6 pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto max-w-6xl"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 px-3.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Bersyon 2026 · Walang Seller Central access na kailangan
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-4 sm:mt-5 text-[1.75rem] leading-tight sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight sm:leading-[1.1] text-foreground break-words"
              >
                Masterin ang{" "}
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Amazon PPC
                </span>{" "}
                sa 12 linggo.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0 break-words"
              >
                Isang kumpletong workbook ng estudyante na naging interactive na
                learning platform. Magbasa ng mga module, magsanay gamit ang live
                na tools, at gumawa ng totoong capstone strategy.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-7 flex flex-col sm:flex-row gap-3"
              >
                <BrandButton
                  size="lg"
                  onClick={() => {
                    setShowForm(true);
                    setAuthMode("signup");
                    setTimeout(() => {
                      document
                        .getElementById("auth-form")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }, 100);
                  }}
                  className="group w-full sm:w-auto"
                >
                  Magsimulang mag-aral nang libre
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </BrandButton>
                <GlassButton
                  size="lg"
                  onClick={handleGuest}
                  className="w-full sm:w-auto"
                >
                  <Play className="h-4 w-4" />
                  Subukan bilang guest
                </GlassButton>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="flex -space-x-1.5">
                  {[
                    "bg-blue-500",
                    "bg-amber-500",
                    "bg-emerald-500",
                    "bg-violet-500",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-6 w-6 rounded-full border-2 border-background",
                        color
                      )}
                    />
                  ))}
                </div>
                <span>Trusted ng mga estudyante at instruktor</span>
              </motion.div>
            </div>

            {/* Right: animated preview card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
              style={{
                x: smoothMouseX.get() * -10,
                y: smoothMouseY.get() * -10,
              }}
              className="relative hidden sm:block"
            >
              <HeroPreviewCard />
            </motion.div>
          </div>

          {/* Stats — social proof row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 sm:mt-16 md:mt-20 px-2 sm:px-0"
          >
            <div className="relative rounded-2xl border border-foreground/5 bg-white/50 dark:bg-stone-900/30 backdrop-blur-sm p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                {stats.map((s, i) => {
                  const StatIcon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.9 + i * 0.08,
                        duration: 0.4,
                      }}
                      className="text-center"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <StatIcon className="h-4 w-4 text-blue-500/60" />
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* Divider                                                      */}
      {/* ============================================================ */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      </div>

      {/* ============================================================ */}
      {/* Features section                                             */}
      {/* ============================================================ */}
      <section id="features" className="relative px-4 sm:px-6 py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 px-3.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Lahat sa isang lugar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Para sa seryosong estudyante.
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}Gustong-gusto ng mga instruktor.
              </span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Bawat piraso ng workbook, ginawang interactive na tools na talagang
              magagamit mo.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-foreground/5 bg-white/60 dark:bg-stone-900/30 backdrop-blur-sm p-6 hover:border-foreground/10 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300"
                >
                  {/* Hover glow */}
                  <div
                    className={cn(
                      "absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl",
                      f.bgGlow
                    )}
                  />
                  <div
                    className={cn(
                      "relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                      f.gradient
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-[15px]">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                  <ChevronRight className="absolute bottom-5 right-5 h-4 w-4 text-foreground/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* How it works                                                 */}
      {/* ============================================================ */}
      <section
        id="how-it-works"
        className="relative px-4 sm:px-6 py-20 sm:py-28 bg-gradient-to-b from-transparent via-blue-50/40 dark:via-blue-950/10 to-transparent"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 px-3.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 mb-4">
              <Zap className="h-3.5 w-3.5" />
              Simpleng proseso
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Paano ito gumagana?
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Mula sa sign up hanggang sa capstone — sundan ang 4 na hakbang.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="relative text-center group"
                >
                  {/* Connecting line (desktop) */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px">
                      <div className="w-full h-full bg-gradient-to-r from-foreground/10 to-foreground/5" />
                      <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/10" />
                    </div>
                  )}

                  {/* Step number + icon */}
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
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Testimonials                                                 */}
      {/* ============================================================ */}
      <section id="testimonials" className="relative px-4 sm:px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/40 px-3.5 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300 mb-4">
              <Heart className="h-3.5 w-3.5" />
              Mga testimonya
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sabihin ng aming mga estudyante
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Tunay na karanasan mula sa mga nakumpleto na ang programa.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 grid-cols-1 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                whileHover={{ y: -3 }}
                className="relative rounded-2xl border border-foreground/5 bg-white/60 dark:bg-stone-900/30 backdrop-blur-sm p-6 hover:border-foreground/10 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300"
              >
                <Quote className="h-8 w-8 text-blue-500/15 mb-3" />
                <p className="text-sm leading-relaxed text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
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
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA section                                                  */}
      {/* ============================================================ */}
      <section className="relative px-4 sm:px-6 py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.08),transparent_50%)]" />

            {/* Content */}
            <div className="relative px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-xs font-medium text-white/90 mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  Mula sa workbook hanggang sa interactive platform
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
              >
                Handa nang gawin ang
                <br />
                unang hakbang?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 text-base sm:text-lg text-blue-100/80 max-w-xl mx-auto leading-relaxed"
              >
                Sumali sa mga estudyante na nagsimula na sa kanilang Amazon PPC
                journey. Walang bayad sa simula — subukan mo muna, pagkatiwalaan
                mo ang sarili mo.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
              >
                <BrandButton
                  size="lg"
                  variant="accent"
                  onClick={() => {
                    setShowForm(true);
                    setAuthMode("signup");
                    setTimeout(() => {
                      document
                        .getElementById("auth-form")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }, 100);
                  }}
                  className="group w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10"
                >
                  Magsimula ngayon — libre
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </BrandButton>
                <GlassButton
                  size="lg"
                  onClick={handleGuest}
                  className="w-full sm:w-auto border-white/25 text-white hover:bg-white/15 hover:text-white"
                >
                  <Play className="h-4 w-4" />
                  Subukan bilang guest
                </GlassButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-blue-200/60"
              >
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Walang credit card
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Libre sa simula
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  I-cancel kahit kailan
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Auth form section                                            */}
      {/* ============================================================ */}
      <section id="auth-form" className="relative px-4 sm:px-6 py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <AuthCard
                  authMode={authMode}
                  setAuthMode={setAuthMode}
                  email={email}
                  setEmail={setEmail}
                  name={name}
                  setName={setName}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  submitting={submitting}
                  handleSubmit={handleSubmit}
                  handleGuest={handleGuest}
                />
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative rounded-2xl border border-foreground/5 bg-white/60 dark:bg-stone-900/30 backdrop-blur-sm p-5 sm:p-8 md:p-10 overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-2xl" />
                  <Trophy className="h-12 w-12 mx-auto text-amber-500" />
                  <h3 className="mt-5 text-2xl font-bold tracking-tight">
                    Handa nang magsimula?
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Mag-sign in upang masubaybayan ang progreso sa lahat ng 4
                    phases — o sumali bilang guest.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <BrandButton
                      onClick={() => {
                        setShowForm(true);
                        setAuthMode("signup");
                      }}
                      className="w-full sm:w-auto"
                    >
                      Gumawa ng account
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </BrandButton>
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(true)}
                      className="w-full sm:w-auto"
                    >
                      Mayroon na akong account
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Footer                                                       */}
      {/* ============================================================ */}
      <footer className="relative px-4 sm:px-6 py-10 border-t border-foreground/5">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-3 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                  <Flame className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-tight">
                  Amazon PPC Training
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed max-w-xs">
                Isang kumpletong workbook ng estudyante na naging interactive na
                learning platform para sa Amazon PPC advertising.
              </p>
            </div>

            {/* Program */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Programa
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Kurikulum
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground transition-colors">
                    Paano Gumagana
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-foreground transition-colors">
                    Mga Testimonya
                  </a>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Impormasyon
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">
                    {programOverview.title}
                  </span>
                </li>
                <li>Bersyon {programOverview.version}</li>
                <li>{programOverview.duration}</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Amazon PPC Training Program. Lahat ng
              karapatan ay nakalaan.
            </p>
            <p className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Ginawa gamit ang motion · Student Workbook
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================
// Animated hero preview card — shows a mini dashboard mockup
// =============================================================

function HeroPreviewCard() {
  const phaseColors = [
    "from-blue-500 to-blue-600",
    "from-rose-500 to-red-500",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
  ];

  return (
    <div className="relative">
      {/* Glow behind card */}
      <motion.div
        className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-blue-500/20 blur-2xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main mockup card */}
      <div className="relative rounded-2xl glass-strong border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
        {/* Window header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/5">
          <div className="flex gap-1.5 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 text-center text-[10px] text-muted-foreground font-mono">
            ppc-training.app/dashboard
          </div>
        </div>

        {/* Mockup body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Mini progress header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-muted-foreground">
                Iyong progreso
              </div>
              <div className="text-2xl font-bold mt-0.5">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  68%
                </span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-10 w-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 shrink-0"
            />
          </div>

          {/* Animated progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Kabuuang natapos</span>
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

          {/* Phase pills */}
          <div className="space-y-2">
            {phases.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.35 }}
                className="flex items-center gap-2.5"
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br text-white text-[10px] font-bold shadow-sm shrink-0",
                    phaseColors[i]
                  )}
                >
                  {p.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium truncate">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {p.weeks}
                  </div>
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

          {/* Floating mini badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              {
                icon: Trophy,
                label: "Capstone",
                color:
                  "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300",
              },
              {
                icon: Calculator,
                label: "Tools",
                color:
                  "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
              },
              {
                icon: GraduationCap,
                label: "3/4 quizzes",
                color:
                  "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
              },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 2.2 + i * 0.08,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    b.color
                  )}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {b.label}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating accent cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-5 -right-5 rounded-xl glass-strong border border-white/40 dark:border-white/10 shadow-lg p-2.5 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">TACoS</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ↓ 11.2%
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-4 -left-4 rounded-xl glass-strong border border-white/40 dark:border-white/10 shadow-lg p-2.5 hidden sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Score sa quiz</div>
            <div className="text-xs font-bold">5 / 5</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================
// Auth card (login / signup)
// =============================================================

function AuthCard({
  authMode,
  setAuthMode,
  email,
  setEmail,
  name,
  setName,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  submitting,
  handleSubmit,
  handleGuest,
}: {
  authMode: "login" | "signup";
  setAuthMode: (m: "login" | "signup") => void;
  email: string;
  setEmail: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  submitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleGuest: () => void;
}) {
  return (
    <div className="relative">
      {/* Glow */}
      <motion.div
        className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-blue-500/15 blur-xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative rounded-2xl glass-strong border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 p-6 sm:p-8">
        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-foreground/5 mb-6 relative">
          {(["login", "signup"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setAuthMode(mode)}
              className={cn(
                "relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10",
                authMode === mode
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {authMode === mode && (
                <motion.div
                  layoutId="authTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {mode === "login" ? "Mag-sign in" : "Gumawa ng account"}
              </span>
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {authMode === "login"
              ? "Maligayang pagbabalik"
              : "Simulan ang iyong paglalakbay"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            {authMode === "login"
              ? "Mag-sign in upang ipagpatuloy ang iyong training."
              : "Gumawa ng account upang masubaybahan ang iyong progreso."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {authMode === "signup" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5 overflow-hidden"
              >
                <Label htmlFor="name" className="text-xs font-medium">
                  Buong pangalan
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan dela Cruz"
                    className="pl-10 h-11"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="pl-10 h-11"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11"
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {authMode === "login" && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground">
                <input type="checkbox" className="rounded border-input" />
                Tandaan ako
              </label>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Nalimutan ang password?
              </a>
            </div>
          )}

          <BrandButton
            type="submit"
            disabled={submitting}
            className="w-full h-11 group"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {authMode === "login"
                  ? "Nagsi-sign in…"
                  : "Gumagawa ng account…"}
              </>
            ) : (
              <>
                {authMode === "login"
                  ? "Mag-sign in"
                  : "Gumawa ng account"}
                <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </BrandButton>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            o
          </span>
          <div className="flex-1 h-px bg-foreground/10" />
        </div>

        {/* Guest */}
        <GlassButton onClick={handleGuest} className="w-full h-11">
          Magpatuloy bilang guest
        </GlassButton>

        <div className="mt-5 rounded-xl bg-foreground/5 border border-foreground/5 p-3.5 text-center">
          <p className="text-[10px] text-muted-foreground">
            Demo accounts · password:{" "}
            <code className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono text-[9px] text-foreground">
              ppcdemo123
            </code>
          </p>
          <div className="mt-2 flex flex-col gap-1 text-[10px] font-mono text-muted-foreground">
            <span className="truncate">alex.rivera@example.com</span>
            <span className="truncate">taylor.morgan@example.com</span>
            <span className="truncate">instructor.kim@example.com</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground opacity-60">
            O gumawa ng bagong account sa itaas.
          </p>
        </div>
      </div>
    </div>
  );
}
