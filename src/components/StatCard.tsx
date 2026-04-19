import { GlassCard } from "./GlassCard";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  icon?: LucideIcon;
  accent?: "primary" | "secondary" | "accent";
}

export const StatCard = ({ label, value, delta, icon: Icon, accent = "primary" }: StatCardProps) => {
  const ring =
    accent === "secondary"
      ? "from-secondary/40 to-transparent"
      : accent === "accent"
      ? "from-accent/40 to-transparent"
      : "from-primary/40 to-transparent";
  return (
    <GlassCard hover className="relative">
      <div className={cn("absolute -top-px left-6 right-6 h-px bg-gradient-to-r", ring)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {typeof delta === "number" && (
            <p className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium",
              delta >= 0 ? "text-secondary" : "text-accent"
            )}>
              {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {delta >= 0 ? "+" : ""}{delta}% this month
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center glass-subtle",
            accent === "secondary" ? "text-secondary" : accent === "accent" ? "text-accent" : "text-primary"
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </GlassCard>
  );
};
