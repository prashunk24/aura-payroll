import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { Search, ArrowUpRight, ArrowDownLeft, Filter, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { useWallet } from "@/hooks/useWallet";

const statusStyles: Record<string, string> = {
  PROCESSED: "bg-foreground/[0.04] text-foreground border-foreground/10",
  INITIATED: "bg-foreground/[0.04] text-muted-foreground border-foreground/10",
  TAX_WITHHELD: "bg-foreground/[0.04] text-foreground border-foreground/10",
  YIELD_ACTIVE: "bg-foreground/[0.04] text-foreground border-foreground/10",
  FAILED_EXECUTION: "bg-destructive/10 text-destructive border-destructive/20",
};

const Transactions = () => {
  const { isConnected } = useWallet();
  const [filter, setFilter] = useState<string>("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    try {
      const data = await api.get<any[]>(API_ENDPOINTS.payroll.list);
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [isConnected]);

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.status === filter);

  return (
    <DashboardShell
      title="Transactions"
      subtitle="Every payment, deposit, and withdrawal in one timeline."
      actions={
        <GlowButton variant="outline" onClick={fetchTransactions} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Refresh
        </GlowButton>
      }
    >
      <GlassCard>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="glass-subtle flex-1 rounded-xl flex items-center gap-2 h-10 px-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Search transactions…" className="bg-transparent outline-none text-sm flex-1 min-w-0" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["all", "PROCESSED", "INITIATED", "FAILED_EXECUTION"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "h-10 px-3.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap",
                  filter === s
                    ? "bg-foreground text-background"
                    : "glass-subtle text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                <th className="py-3 pr-4 font-semibold">Description</th>
                <th className="py-3 pr-4 font-semibold hidden md:table-cell">Recipient</th>
                <th className="py-3 pr-4 font-semibold hidden sm:table-cell">Date</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto opacity-20" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">No transactions found.</td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02]">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-foreground text-background">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">Payroll Payment</p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[100px]">{t.transactionHash || t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground hidden md:table-cell">{t.employee?.name || "Unknown"}</td>
                    <td className="py-4 pr-4 text-muted-foreground hidden sm:table-cell">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 pr-4">
                      <span className={cn("inline-flex items-center text-[10px] font-medium border rounded-full px-2.5 py-1", statusStyles[t.status] || statusStyles.INITIATED)}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold text-muted-foreground">
                      −${t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardShell>
  );
};

export default Transactions;
