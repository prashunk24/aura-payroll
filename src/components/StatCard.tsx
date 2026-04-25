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

export const StatCard = ({ label, value, delta, icon: Icon }: StatCardProps) => {
  return (
    <GlassCard hover className="relative group">
      <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-foreground/30 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium truncate">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight truncate">{value}</p>
          {typeof delta === "number" && (
            <p className={cn("mt-2 inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium",
              delta >= 0 ? "text-foreground" : "text-destructive"
            )}>
              {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {delta >= 0 ? "+" : ""}{delta}% this month
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-primary text-primary-foreground shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>
    </GlassCard>
  );
};
