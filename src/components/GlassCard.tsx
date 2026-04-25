import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle";
  glow?: "none" | "primary" | "secondary" | "accent";
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", hover = false, children, ...props }, ref) => {
    const variantClass =
      variant === "strong" ? "glass-strong" : variant === "subtle" ? "glass-subtle" : "glass";
    const glowClass =
      glow === "primary" ? "glow-primary" : glow === "secondary" ? "glow-secondary" : glow === "accent" ? "glow-accent" : "";
    return (
      <div
        ref={ref}
        className={cn(
          variantClass,
          glowClass,
          hover && "hover-lift",
          "rounded-2xl sm:rounded-3xl p-4 sm:p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
