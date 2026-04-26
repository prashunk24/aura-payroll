import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { Search, ArrowUpRight, ArrowDownLeft, Filter, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const all = [
  { id: "TX-2841", name: "April salary batch", employee: "44 employees", amount: -184200, date: "Apr 1, 2025", status: "success" },
  { id: "TX-2840", name: "Tax vault routing", employee: "System", amount: -33156, date: "Apr 1, 2025", status: "success" },
  { id: "TX-2839", name: "Vault yield distribution", employee: "System", amount: 412, date: "Mar 31, 2025", status: "success" },
  { id: "TX-2838", name: "Funds added", employee: "Bank transfer", amount: 50000, date: "Mar 28, 2025", status: "success" },
  { id: "TX-2837", name: "Bonus · Q1 perf.", employee: "12 employees", amount: -12400, date: "Mar 25, 2025", status: "success" },
  { id: "TX-2836", name: "Salary · A. Lovelace", employee: "Ada Lovelace", amount: -6800, date: "Mar 22, 2025", status: "pending" },
  { id: "TX-2835", name: "Salary · L. Torvalds", employee: "Linus Torvalds", amount: -6200, date: "Mar 22, 2025", status: "failed" },
];

const statusStyles: Record<string, string> = {
  success: "bg-foreground/[0.04] text-foreground border-foreground/10",
  pending: "bg-foreground/[0.04] text-muted-foreground border-foreground/10",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const Transactions = () => {
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? all : all.filter(t => t.status === filter);

  return (
    <DashboardShell
      title="Transactions"
      subtitle="Every payment, deposit, and withdrawal in one timeline."
      actions={
        <GlowButton variant="outline">
          <Download className="w-4 h-4" /> Export
        </GlowButton>
      }
    >
      <GlassCard>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="glass-subtle flex-1 rounded-xl flex items-center gap-2 h-10 px-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Search transactions…" className="bg-transparent outline-none text-sm flex-1 min-w-0" />
          </div>
          <div className="flex gap-2">
            {["all", "success", "pending", "failed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "h-10 px-3.5 rounded-xl text-xs font-medium transition-colors capitalize",
                  filter === s
                    ? "bg-foreground text-background"
                    : "glass-subtle text-muted-foreground hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                <th className="py-3 pr-4 font-semibold">Description</th>
                <th className="py-3 pr-4 font-semibold hidden md:table-cell">Reference</th>
                <th className="py-3 pr-4 font-semibold hidden sm:table-cell">Date</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02]">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center",
                        t.amount > 0 ? "bg-foreground/[0.04] border border-foreground/10" : "bg-foreground text-background"
                      )}>
                        {t.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{t.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground hidden md:table-cell">{t.employee}</td>
                  <td className="py-4 pr-4 text-muted-foreground hidden sm:table-cell">{t.date}</td>
                  <td className="py-4 pr-4">
                    <span className={cn("inline-flex items-center text-[11px] font-medium border rounded-full px-2.5 py-1 capitalize", statusStyles[t.status])}>
                      {t.status}
                    </span>
                  </td>
                  <td className={cn("py-4 text-right font-semibold", t.amount > 0 ? "text-foreground" : "text-muted-foreground")}>
                    {t.amount > 0 ? "+" : "−"}${Math.abs(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardShell>
  );
};

export default Transactions;
