import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { FileText, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const reports = [
  { name: "April 2025 · Payroll summary", period: "Apr 2025", type: "Payroll", status: "ready" },
  { name: "Q1 2025 · Tax filing report", period: "Jan – Mar 2025", type: "Tax", status: "ready" },
  { name: "March 2025 · Payroll summary", period: "Mar 2025", type: "Payroll", status: "ready" },
  { name: "April 2025 · Tax withholding", period: "Apr 2025", type: "Tax", status: "pending" },
  { name: "FY 2024 · Annual statement", period: "2024", type: "Annual", status: "ready" },
];

const statusMap = {
  ready: { label: "Ready for filing", icon: CheckCircle2, cls: "text-foreground" },
  pending: { label: "Pending", icon: Clock, cls: "text-muted-foreground" },
  failed: { label: "Failed", icon: AlertCircle, cls: "text-destructive" },
};

const Reports = () => {
  return (
    <DashboardShell title="Reports & compliance" subtitle="Download payroll history, tax filings, and annual statements.">
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Reports generated</p>
          <p className="text-2xl font-semibold mt-1">38</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Filings completed</p>
          <p className="text-2xl font-semibold mt-1">12</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Next deadline</p>
          <p className="text-2xl font-semibold mt-1">Apr 30</p>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold">Available reports</h2>
          <div className="flex gap-2">
            <GlowButton variant="outline" size="sm">PDF</GlowButton>
            <GlowButton variant="outline" size="sm">CSV</GlowButton>
          </div>
        </div>

        <div className="divide-y divide-foreground/5">
          {reports.map((r) => {
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
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-xl glass-subtle hover:bg-foreground/[0.06] transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </DashboardShell>
  );
};

export default Reports;
