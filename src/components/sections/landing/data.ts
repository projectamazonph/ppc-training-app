import {
  BookOpen, PenLine, Calculator, Trophy, User as UserIcon,
  Target, Award, Layers, Clock, Zap, Heart, Sparkles,
} from "lucide-react";

export const stats = [
  { value: "4", label: "Phases", icon: Layers },
  { value: "10", label: "Modules", icon: BookOpen },
  { value: "11", label: "Exercises", icon: PenLine },
  { value: "12", label: "Weeks", icon: Clock },
];

export const features = [
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "10 modules across 4 phases — from Amazon fundamentals to a complete capstone strategy.",
    gradient: "from-blue-500 to-blue-600",
    glow: "bg-blue-500/10",
  },
  {
    icon: PenLine,
    title: "Interactive Exercises",
    description:
      "Open-ended, calculation, and decision-based exercises with live feedback.",
    gradient: "from-amber-500 to-orange-500",
    glow: "bg-amber-500/10",
  },
  {
    icon: Calculator,
    title: "Live PPC Tools",
    description:
      "Metrics calculator, search term analyzer, and a 4-layer campaign builder.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "bg-emerald-500/10",
  },
  {
    icon: Trophy,
    title: "Capstone Project",
    description:
      "Build a complete PPC strategy and present it as if your instructor is the client.",
    gradient: "from-violet-500 to-purple-600",
    glow: "bg-violet-500/10",
  },
];

export const howItWorks = [
  {
    step: "01",
    title: "Sign Up Free",
    description: "Create an account in seconds. No credit card required.",
    icon: UserIcon,
  },
  {
    step: "02",
    title: "Access Curriculum",
    description: "10 modules across 4 phases — from fundamentals to advanced strategy.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "Practice with Tools",
    description: "Use live PPC tools, search term analyzer, and campaign builder.",
    icon: Target,
  },
  {
    step: "04",
    title: "Complete the Capstone",
    description: "Build a real PPC strategy and present it to your instructor.",
    icon: Award,
  },
];

export const testimonials = [
  {
    name: "Maria Santos",
    role: "Amazon Seller",
    quote:
      "The structured curriculum transformed how I manage PPC campaigns. I feel much more confident now.",
    rating: 5,
  },
  {
    name: "Carlos Reyes",
    role: "E-commerce Manager",
    quote:
      "The live tools were the most helpful. It's not just theory — you actually apply what you learn right away.",
    rating: 5,
  },
  {
    name: "Ana Lim",
    role: "Virtual Assistant",
    quote:
      "From zero knowledge, I launched my own PPC campaign after 12 weeks. Totally worth it!",
    rating: 5,
  },
];
