"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BrandButton, GlassButton } from "@/components/shared/buttons";
import { useAppStore, type User } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "./motion";

type AuthFormProps = {
  show: boolean;
  mode: "login" | "signup";
  onSwitchMode: (m: "login" | "signup") => void;
};

export function AuthForm({ show, mode, onSwitchMode }: AuthFormProps) {
  const login = useAppStore((s) => s.login);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const prefersReduced = useReducedMotion();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Missing field", description: "Email and password are required.", variant: "destructive" });
      return;
    }
    if (mode === "signup" && !name.trim()) {
      toast({ title: "Name is required", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (mode === "signup" && password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = mode === "login"
        ? { email: email.trim(), password }
        : { name: name.trim(), email: email.trim(), password, cohort: "Spring 2026" };

      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      const dbRole = (data.user.role ?? "STUDENT").toLowerCase() as User["role"];
      login({
        id: data.user.id, name: data.user.name, email: data.user.email,
        role: dbRole, status: data.user.status, cohort: data.user.cohort ?? null,
        currentPhase: data.user.currentPhase ?? 1, targetAcos: data.user.targetAcos ?? 30,
        loggedInAt: Date.now(), serverProgress: data.progress,
      });
      const fn = data.user.name.split(" ")[0];
      toast({
        title: mode === "login" ? `Welcome back, ${fn}!` : `Welcome, ${fn}!`,
        description: mode === "login" ? `Signed in as ${dbRole}.` : "Your training journey begins.",
      });
    } catch (err: any) {
      toast({ title: mode === "login" ? "Sign in failed" : "Sign up failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const onGuest = () => {
    login({ name: "Guest Student", email: "guest@ppc-training.local", role: "guest", loggedInAt: Date.now() });
    toast({ title: "Viewing as Guest", description: "Progress is saved locally." });
  };

  return (
    <section id="auth-form" className="relative px-4 sm:px-6 py-10 sm:py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          {show ? (
            <motion.div
              key="form"
              initial={prefersReduced ? false : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: DURATION, ease: EASE }}
            >
              <motion.div
                className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-blue-500/15 blur-xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative rounded-2xl glass-strong border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 p-6 sm:p-8">
                {/* Tabs */}
                <div className="flex p-1 rounded-xl bg-foreground/5 mb-6 relative">
                  {(["login", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => onSwitchMode(m)}
                      className={cn(
                        "relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10",
                        mode === m ? "text-white" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {mode === m && (
                        <motion.div layoutId="authTab" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                      )}
                      <span className="relative z-10">{m === "login" ? "Sign In" : "Create Account"}</span>
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{mode === "login" ? "Welcome back" : "Start Your Journey"}</h2>
                  <p className="text-sm text-muted-foreground mt-1.5">{mode === "login" ? "Sign in to continue your training." : "Create an account to track your progress."}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {mode === "signup" && (
                      <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="space-y-1.5 overflow-hidden">
                        <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" className="pl-10 h-11" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="pl-10 h-11" autoComplete="email" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 h-11" autoComplete={mode === "login" ? "current-password" : "new-password"} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === "login" && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground">
                        <input type="checkbox" className="rounded border-input" /> Remember me
                      </label>
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
                    </div>
                  )}

                  <BrandButton type="submit" disabled={submitting} className="w-full h-11 group">
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {mode === "login" ? "Signing in\u2026" : "Creating account\u2026"}</>
                    ) : (
                      <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" /></>
                    )}
                  </BrandButton>
                </form>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-foreground/10" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-foreground/10" />
                </div>

                <GlassButton onClick={onGuest} className="w-full h-11">Continue as Guest</GlassButton>

                <div className="mt-5 rounded-xl bg-foreground/5 border border-foreground/5 p-3.5 text-center">
                  <p className="text-[10px] text-muted-foreground">
                    Demo accounts &middot; password: <code className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono text-[9px] text-foreground">ppcdemo123</code>
                  </p>
                  <div className="mt-2 flex flex-col gap-1 text-[10px] font-mono text-muted-foreground">
                    <span className="truncate">alex.rivera@example.com</span>
                    <span className="truncate">taylor.morgan@example.com</span>
                    <span className="truncate">instructor.kim@example.com</span>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground opacity-60">Or create a new account above.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cta"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION }}
              className="text-center"
            >
              <div className="relative rounded-2xl border border-foreground/5 bg-white/60 dark:bg-stone-900/30 backdrop-blur-sm p-5 sm:p-8 md:p-10 overflow-hidden">
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-2xl" />
                <Trophy className="h-12 w-12 mx-auto text-amber-500" />
                <h3 className="mt-5 text-2xl font-bold tracking-tight">Ready to Get Started?</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Sign in to track your progress across all 4 phases — or join as a guest.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <BrandButton onClick={() => onSwitchMode("signup")} className="w-full sm:w-auto">
                    Create Account <ArrowRight className="h-4 w-4 ml-1.5" />
                  </BrandButton>
                  <Button variant="outline" onClick={() => onSwitchMode("login")} className="w-full sm:w-auto">
                    I already have an account
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
