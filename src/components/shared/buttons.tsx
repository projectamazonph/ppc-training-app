"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// =============================================================
// Brand Button — primary CTA
// =============================================================

const brandButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm",
        accent:
          "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm",
        danger:
          "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm",
        outline:
          "border border-primary-200 dark:border-primary-800 bg-transparent text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/30",
        ghost:
          "bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brandButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const BrandButton = forwardRef<HTMLButtonElement, BrandButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(brandButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
BrandButton.displayName = "BrandButton";

// =============================================================
// Glass Button — secondary CTA with glassmorphism
// =============================================================

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] border",
  {
    variants: {
      variant: {
        default:
          "glass-strong border-white/40 dark:border-white/10 text-foreground hover:bg-white/80 dark:hover:bg-white/10",
        subtle:
          "bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-white/10",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

export { BrandButton, GlassButton, brandButtonVariants, glassButtonVariants };
