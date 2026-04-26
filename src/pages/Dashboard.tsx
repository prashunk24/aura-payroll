import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GlowButton } from "@/components/GlowButton";
import { SalarySplitFlow } from "@/components/SalarySplitFlow";
import { RunPayrollModal } from "@/components/RunPayrollModal";
import { useState } from "react";
import {
  Wallet,
  Users,
  Receipt,
  TrendingUp,
  PlayCircle,
  AlertCircle,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const recentTx = [
  { id: 1, name: "April salary batch", amount: 184200, type: "out", date: "Apr 1", status: "Completed" },
  { id: 2, name: "Tax vault yield", amount: 412, type: "in", date: "Mar 31", status: "Completed" },
  { id: 3, name: "Funds added", amount: 50000, type: "in", date: "Mar 28", status: "Completed" },
  { id: 4, name: "Bonus · Q1 perf.", amount: 12400, type: "out", date: "Mar 25", status: "Completed" },
];

const Dashboard = () => {
  const [runOpen, setRunOpen] = useState(false);

  return (
    <DashboardShell
      title="Welcome back, Acme"
      subtitle="Your team is on track. Next payroll runs in 2 days, 14 hours."
      actions={
        <GlowButton onClick={() => setRunOpen(true)}>
          <PlayCircle className="w-4 h-4" /> Run payroll
        </GlowButton>
      }
    >
      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-5 glass rounded-2xl p-4 flex items-start sm:items-center gap-3 flex-col sm:flex-row"
      >
        <div className="w-9 h-9 rounded-xl bg-foreground/[0.06] border border-foreground/10 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Treasury balance is sufficient for the next 3 payrolls.</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Top up by Apr 28 to avoid interruption. <Link to="/app/funds" className="underline underline-offset-4 text-foreground">Add funds →</Link>
          </p>
        </div>
      </motion.div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total payroll" value="$184,200" delta={4.2} icon={Wallet} />
        <StatCard label="Employees paid" value="44" delta={2.3} icon={Users} />
        <StatCard label="Tax withheld" value="$33,156" delta={4.2} icon={Receipt} />
        <StatCard label="Yield earned" value="$8,412" delta={12.8} icon={TrendingUp} />
      </div>

      {/* Salary split + Upcoming */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold">Salary split</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                How each payroll dollar flows to your team and tax reserves.
              </p>
            </div>
            <span className="hidden sm:inline-flex text-[11px] font-medium text-muted-foreground border border-foreground/10 rounded-full px-2.5 py-1">
              Live preview
            </span>
          </div>
          <SalarySplitFlow total={184200} taxRate={18} />
        </GlassCard>

        <GlassCard variant="strong">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" />
            <h2 className="text-base font-semibold">Upcoming payroll</h2>
          </div>
          <p className="text-3xl font-semibold tracking-tight">$184,200</p>
          <p className="text-xs text-muted-foreground mt-1">May 1 · 44 recipients</p>

          <div className="mt-5 space-y-2.5">
            {[
              { name: "Engineering", count: 24, amt: 92400 },
              { name: "Design", count: 8, amt: 38000 },
              { name: "Operations", count: 12, amt: 53800 },
            ].map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="text-xs font-medium flex-1">{d.name}</span>
                <div className="flex-1 h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.amt / 92400) * 100}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full bg-foreground rounded-full"
                  />
                </div>
                <span className="text-xs font-semibold w-16 text-right">${(d.amt / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>

          <Link to="/app/payroll" className="mt-6 inline-flex items-center gap-1 text-xs font-semibold underline-offset-4 hover:underline">
            Configure schedule <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </GlassCard>
      </div>

      {/* Recent activity */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold">Recent activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest transactions across your account.</p>
          </div>
          <Link to="/app/transactions" className="text-xs font-semibold hover:underline underline-offset-4">View all →</Link>
        </div>
        <div className="divide-y divide-foreground/5">
          {recentTx.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-3.5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${t.type === "in" ? "bg-foreground/[0.04] border-foreground/10" : "bg-foreground text-background border-foreground"}`}>
                {t.type === "in" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.date} · {t.status}</p>
              </div>
              <p className={`text-sm font-semibold ${t.type === "in" ? "text-foreground" : "text-muted-foreground"}`}>
                {t.type === "in" ? "+" : "−"}${t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <RunPayrollModal open={runOpen} onOpenChange={setRunOpen} total={184200} employees={44} taxRate={18} />
    </DashboardShell>
  );
};

export default Dashboard;
