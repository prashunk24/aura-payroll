import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { SalarySplitFlow } from "@/components/SalarySplitFlow";
import { RunPayrollModal } from "@/components/RunPayrollModal";
import { PlayCircle, Calendar, Clock, Users, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const steps = [
  { n: 1, title: "Add your employees", desc: "Import from CSV, invite by email, or add manually." },
  { n: 2, title: "Set salaries & tax rules", desc: "Define base pay, tax rates, and auto-routing to your vault." },
  { n: 3, title: "Run payroll", desc: "Review the breakdown, confirm — done in seconds." },
];

const upcoming = [
  { date: "May 1, 2025", recipients: 44, total: 184200, status: "Scheduled" },
  { date: "Jun 1, 2025", recipients: 44, total: 184200, status: "Scheduled" },
  { date: "Jul 1, 2025", recipients: 44, total: 184200, status: "Scheduled" },
];

const Payroll = () => {
  const [runOpen, setRunOpen] = useState(false);

  return (
    <DashboardShell
      title="Run payroll"
      subtitle="Review your monthly batch, then send. Funds settle instantly."
      actions={
        <GlowButton onClick={() => setRunOpen(true)} size="lg">
          <PlayCircle className="w-4 h-4" /> Run payroll now
        </GlowButton>
      }
    >
      {/* Hero summary */}
      <GlassCard variant="strong" className="mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Next batch</p>
            <p className="mt-1 text-4xl sm:text-5xl font-semibold tracking-tight">$184,200</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> May 1, 2025</span>
              <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 44 recipients</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Settles instantly</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <SalarySplitFlow total={184200} taxRate={18} />
          </div>
        </div>
      </GlassCard>

      {/* 3-step guide */}
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        {steps.map((s) => (
          <GlassCard key={s.n}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
                {s.n}
              </span>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm">{s.title}</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Schedule */}
      <GlassCard>
        <h2 className="text-base font-semibold mb-4">Upcoming schedule</h2>
        <div className="divide-y divide-foreground/5">
          {upcoming.map((p) => (
            <div key={p.date} className="py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{p.date}</p>
                <p className="text-xs text-muted-foreground">{p.recipients} recipients · auto-run</p>
              </div>
              <p className="text-sm font-semibold">${p.total.toLocaleString()}</p>
              <span className="hidden sm:inline-flex text-[11px] font-medium text-muted-foreground border border-foreground/10 rounded-full px-2.5 py-1">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <RunPayrollModal open={runOpen} onOpenChange={setRunOpen} total={184200} employees={44} taxRate={18} />
    </DashboardShell>
  );
};

export default Payroll;
