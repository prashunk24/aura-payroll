import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "strong" | "subtle";
  glow?: "none" | "primary" | "secondary" | "accent";
  hover?: boolean;
  animate?: boolean;
  delay?: number;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", hover = false, animate = true, delay = 0, children, ...props }, ref) => {
    const variantClass =
      variant === "strong" ? "glass-strong" : variant === "subtle" ? "glass-subtle" : "glass";
    const glowClass =
      glow === "primary" ? "glow-primary" : glow === "secondary" ? "glow-secondary" : glow === "accent" ? "glow-accent" : "";

    const motionProps = animate
      ? {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
          whileHover: hover ? { y: -4, transition: { duration: 0.25, ease: "easeOut" as const } } : undefined,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        {...props}
        className={cn(
          variantClass,
          glowClass,
          "rounded-2xl sm:rounded-3xl p-4 sm:p-6 will-change-transform",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
