import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GlowButton } from "@/components/GlowButton";
import { SalarySplitFlow } from "@/components/SalarySplitFlow";
import { RunPayrollModal } from "@/components/RunPayrollModal";
import { useState, useEffect } from "react";
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
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { useWallet } from "@/hooks/useWallet";

const DEFAULT_STATS = {
  totalPayroll: 0,
  totalEmployees: 0,
  totalTaxWithheld: 0,
  activeYield: 0,
};

const money = (v: unknown) =>
  `$${(typeof v === "number" && Number.isFinite(v) ? v : 0).toLocaleString()}`;

const Dashboard = () => {
  const { isConnected } = useWallet();
  const [runOpen, setRunOpen] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    if (!isConnected) return;
    let cancelled = false;
    let failures = 0;

    const fetchStats = async () => {
      try {
        const data = await api.get<Partial<typeof DEFAULT_STATS>>(API_ENDPOINTS.stats.overview);
        if (cancelled) return;
        failures = 0;
        setStats({ ...DEFAULT_STATS, ...(data ?? {}) });
      } catch {
        // Backend offline: stop polling after a few tries instead of hammering it
        failures += 1;
        if (failures >= 3) clearInterval(interval);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isConnected]);


  return (
    <DashboardShell
      title="Welcome back, Acme"
      subtitle="Your team is on track. Intelligent flows are active."
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
        <StatCard label="Total payroll" value={money(stats.totalPayroll)} icon={Wallet} />
        <StatCard label="Employees paid" value={String(stats.totalEmployees ?? 0)} icon={Users} />
        <StatCard label="Tax withheld" value={money(stats.totalTaxWithheld)} icon={Receipt} />
        <StatCard label="Yield earned" value={money(stats.activeYield)} icon={TrendingUp} />
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

      <RunPayrollModal open={runOpen} onOpenChange={setRunOpen} total={184200} employees={44} taxRate={18} />
    </DashboardShell>
  );
};

export default Dashboard;
