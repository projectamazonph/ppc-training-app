"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { Navbar } from "./Navbar";
import { PreviewCard } from "./PreviewCard";
import { Hero, Stats, Features, HowItWorks, Testimonials, CTA, Footer } from "./Sections";
import { AuthForm } from "./AuthForm";

export function LandingPage() {
  const login = useAppStore((s) => s.login);
  const user = useAppStore((s) => s.user);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const scrollToAuth = useCallback(() => {
    setShowForm(true);
    setTimeout(() => document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }, []);

  const goSignup = useCallback(() => { setAuthMode("signup"); scrollToAuth(); }, [scrollToAuth]);
  const goLogin = useCallback(() => { setAuthMode("login"); scrollToAuth(); }, [scrollToAuth]);

  const handleGuest = useCallback(() => {
    login({ name: "Guest Student", email: "guest@ppc-training.local", role: "guest", loggedInAt: Date.now() });
    toast({ title: "Viewing as Guest", description: "Progress is saved locally." });
  }, [login, toast]);

  if (user) return null;

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900" />
        <div className="absolute -top-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-1/4 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-400/15 dark:bg-amber-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-400/15 dark:bg-indigo-500/8 blur-[100px]" />
      </div>

      <Navbar onSignIn={goLogin} onGetStarted={goSignup} />
      <Hero onSignup={goSignup} onGuest={handleGuest} Preview={<PreviewCard />} />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA onSignup={goSignup} onGuest={handleGuest} />
      <AuthForm show={showForm} mode={authMode} onSwitchMode={setAuthMode} />
      <Footer />
    </div>
  );
}
