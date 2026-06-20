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
          "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-600/30",
        accent:
          "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md shadow-accent-500/20 hover:from-accent-600 hover:to-accent-700 hover:shadow-lg hover:shadow-accent-500/30",
        success:
          "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700",
        danger:
          "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-red-700",
        outline:
          "border-2 border-primary-200 dark:border-primary-800 bg-transparent text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:border-primary-300 dark:hover:border-primary-700",
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
