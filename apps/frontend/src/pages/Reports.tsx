import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { FileText, Download, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

const statusMap = {
  ready: { label: "Ready for filing", icon: CheckCircle2, cls: "text-foreground" },
  pending: { label: "Pending", icon: Clock, cls: "text-muted-foreground" },
  failed: { label: "Failed", icon: AlertCircle, cls: "text-destructive" },
};

const Reports = () => {
  const { isConnected } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    try {
      const data = await api.get<any[]>(API_ENDPOINTS.payroll.list);
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions for reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [isConnected]);

  // Dynamically generate monthly reports based on real transaction history
  const generatedReports = useMemo(() => {
    if (!transactions.length) return [];
    
    const months = new Map<string, { count: number; status: string }>();
    
    transactions.forEach(t => {
      const date = new Date(t.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!months.has(monthYear)) {
        months.set(monthYear, { count: 1, status: t.status === 'PROCESSED' || t.status === 'YIELD_ACTIVE' || t.status === 'TAX_WITHHELD' ? 'ready' : 'pending' });
      } else {
        const data = months.get(monthYear)!;
        data.count += 1;
        // If any transaction in that month is pending/failed, mark report as pending
        if (t.status === 'INITIATED' || t.status === 'FAILED_EXECUTION') {
          data.status = 'pending';
        }
      }
    });

    const reportsList: any[] = [];
    months.forEach((data, month) => {
      reportsList.push({
        name: `${month} · Payroll Summary`,
        period: month,
        type: "Payroll",
        status: data.status,
      });
      // Also generate a mock Tax report for that month
      reportsList.push({
        name: `${month} · Tax Withholding`,
        period: month,
        type: "Tax",
        status: data.status,
      });
    });

    return reportsList;
  }, [transactions]);

  const handleDownload = (name: string) => {
    toast.success(`Downloading ${name}...`);
  };

  return (
    <DashboardShell title="Reports & compliance" subtitle="Download payroll history, tax filings, and annual statements.">
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Reports generated</p>
          <p className="text-2xl font-semibold mt-1">{isLoading ? "-" : generatedReports.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Filings completed</p>
          <p className="text-2xl font-semibold mt-1">{isLoading ? "-" : generatedReports.filter(r => r.status === 'ready').length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Next deadline</p>
          <p className="text-2xl font-semibold mt-1">End of Month</p>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold">Available reports</h2>
          <div className="flex gap-2">
            <GlowButton variant="outline" size="sm" onClick={fetchTransactions} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
            </GlowButton>
          </div>
        </div>

        <div className="divide-y divide-foreground/5">
          {isLoading ? (
            <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto opacity-20" /></div>
          ) : generatedReports.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              {isConnected ? "No payroll data available yet." : "Connect wallet to view reports."}
            </div>
          ) : (
            generatedReports.map((r) => {
              const s = statusMap[r.status as keyof typeof statusMap];
              const Icon = s.icon;
              return (
                <div key={r.name} className="py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.period} · {r.type}</p>
                  </div>
                  <span className={cn("hidden sm:inline-flex items-center gap-1.5 text-xs font-medium", s.cls)}>
                    <Icon className="w-3.5 h-3.5" /> {s.label}
                  </span>
                  <button onClick={() => handleDownload(r.name)} className="inline-flex items-center justify-center w-9 h-9 rounded-xl glass-subtle hover:bg-foreground/[0.06] transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>
    </DashboardShell>
  );
};

export default Reports;
