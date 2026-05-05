import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const sizeClass =
      size === "sm" ? "px-4 py-2 text-sm" : size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
    const base = "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed";

    if (variant === "ghost") {
      return (
        <button ref={ref} className={cn(base, sizeClass, "glass-subtle hover:bg-foreground/5 text-foreground", className)} {...props}>
          {children}
        </button>
      );
    }
    if (variant === "outline") {
      return (
        <button ref={ref} className={cn(base, sizeClass, "border border-foreground/15 bg-background hover:bg-muted text-foreground", className)} {...props}>
          {children}
        </button>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(base, sizeClass, "bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-[0_12px_40px_-8px_hsl(0_0%_0%/0.45)] shadow-[0_6px_20px_-6px_hsl(0_0%_0%/0.3)]", className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
GlowButton.displayName = "GlowButton";
