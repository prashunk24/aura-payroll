import { motion } from "framer-motion";
import { Wallet, Users, Vault, TrendingUp } from "lucide-react";

interface SalarySplitFlowProps {
  total?: number;
  taxRate?: number; // percentage
  yieldRate?: number; // % of tax routed to yield strategy
}

const num = (v: unknown, fallback = 0) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

const fmt = (n: unknown) =>
  num(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const SalarySplitFlow = ({ total = 0, taxRate = 0, yieldRate = 100 }: SalarySplitFlowProps) => {
  const safeTotal = num(total);
  const safeRate = Math.min(100, Math.max(0, num(taxRate)));
  const tax = (safeTotal * safeRate) / 100;
  const net = safeTotal - tax;
  const toYield = (tax * num(yieldRate, 100)) / 100;

  return (
    <div className="relative w-full">
      {/* Desktop / tablet flow */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-6">
        {/* Source */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total payroll</p>
              <p className="text-xl font-semibold truncate">{fmt(total)}</p>
            </div>
          </div>
        </motion.div>

        {/* Animated SVG splitter */}
        <svg viewBox="0 0 120 200" className="w-24 lg:w-32 h-44" aria-hidden>
          <defs>
            <linearGradient id="flowGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="hsl(0 0% 0%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(0 0% 0%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Top branch (employees) */}
          <motion.path
            d="M 0 100 C 50 100, 50 30, 120 30"
            fill="none"
            stroke="url(#flowGrad)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          {/* Bottom branch (vault) */}
          <motion.path
            d="M 0 100 C 50 100, 50 170, 120 170"
            fill="none"
            stroke="url(#flowGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
          />
          {/* Pulses */}
          <motion.circle
            r="3"
            fill="hsl(0 0% 0%)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ offsetPath: "path('M 0 100 C 50 100, 50 30, 120 30')" } as React.CSSProperties}
          />
          <motion.circle
            r="2.5"
            fill="hsl(0 0% 0%)"
            opacity="0.5"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
            style={{ offsetPath: "path('M 0 100 C 50 100, 50 170, 120 170')" } as React.CSSProperties}
          />
        </svg>

        {/* Targets stacked */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">To employees</p>
                  <span className="text-[10px] font-semibold text-muted-foreground">{(100 - taxRate).toFixed(0)}%</span>
                </div>
                <p className="text-lg font-semibold truncate">{fmt(net)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center">
                <Vault className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Tax vault</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    earning {fmt(toYield * 0.054).replace("$", "$")}
                  </span>
                </div>
                <p className="text-lg font-semibold truncate">{fmt(tax)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile vertical stack */}
      <div className="sm:hidden space-y-2">
        <div className="glass rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total payroll</p>
          <p className="text-xl font-semibold">{fmt(total)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Employees</p>
            <p className="text-base font-semibold">{fmt(net)}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tax vault</p>
            <p className="text-base font-semibold">{fmt(tax)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
