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
    <div className="w-full space-y-3">
      {/* Source */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total payroll</p>
            <p className="text-xl font-semibold truncate">{fmt(safeTotal)}</p>
          </div>
        </div>
      </div>

      {/* Static split bar */}
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-foreground/10">
        <div className="bg-foreground" style={{ width: `${100 - safeRate}%` }} />
        <div className="bg-foreground/30" style={{ width: `${safeRate}%` }} />
      </div>

      {/* Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">To employees</p>
                <span className="text-[10px] font-semibold text-muted-foreground">{(100 - safeRate).toFixed(0)}%</span>
              </div>
              <p className="text-lg font-semibold truncate">{fmt(net)}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center shrink-0">
              <Vault className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Tax vault</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  {fmt(toYield * 0.054)}
                </span>
              </div>
              <p className="text-lg font-semibold truncate">{fmt(tax)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
