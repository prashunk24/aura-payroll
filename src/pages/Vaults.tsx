import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { StatCard } from "@/components/StatCard";
import { Vault, TrendingUp, PiggyBank, Sparkles } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { toast } from "sonner";

const yieldData = [
  { m: "Nov", balance: 380000, earned: 320 },
  { m: "Dec", balance: 410000, earned: 410 },
  { m: "Jan", balance: 445000, earned: 540 },
  { m: "Feb", balance: 478000, earned: 690 },
  { m: "Mar", balance: 502000, earned: 820 },
  { m: "Apr", balance: 524180, earned: 910 },
];

const Vaults = () => {
  return (
    <DashboardShell
      title="Vaults"
      subtitle="Idle reserves earn yield through audited, low-risk strategies."
      actions={
        <GlowButton onClick={() => toast.success("Yield strategy optimized")}>
          <Sparkles className="w-4 h-4" /> Optimize yield
        </GlowButton>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <StatCard label="Total stored" value="$524,180" delta={6.4} icon={Vault} />
        <StatCard label="Current APY" value="5.42%" delta={0.4} icon={TrendingUp} />
        <StatCard label="Yield earned (YTD)" value="$8,412" delta={12.8} icon={PiggyBank} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Growth over time</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Vault balance and monthly yield earned.</p>
            </div>
          </div>
          <div className="h-[280px] sm:h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData} margin={{ left: -8, right: 8, top: 10 }}>
                <defs>
                  <linearGradient id="vaultGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0 0% 0%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(0 0% 0%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(0 0% 0% / 0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(0 0% 40%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0 0% 40%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100% / 0.95)",
                    border: "1px solid hsl(0 0% 0% / 0.08)",
                    borderRadius: 12,
                    backdropFilter: "blur(12px)",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="balance" stroke="hsl(0 0% 0%)" fill="url(#vaultGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="strong">
          <h2 className="text-base font-semibold mb-1">Strategy details</h2>
          <p className="text-xs text-muted-foreground mb-5">Diversified across audited, low-risk venues.</p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Strategy</span><span className="font-medium">Stable Yield</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Risk profile</span><span className="font-medium">Low</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Liquidity</span><span className="font-medium">Instant</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Last rebalance</span><span className="font-medium">2h ago</span></div>
          </div>

          <div className="mt-6 pt-5 border-t border-foreground/10">
            <p className="text-xs text-muted-foreground mb-3">Allocation</p>
            {[
              { name: "Money market", pct: 60 },
              { name: "Short-term lending", pct: 30 },
              { name: "Cash reserve", pct: 10 },
            ].map((a) => (
              <div key={a.name} className="mb-2.5 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span>{a.name}</span>
                  <span className="text-muted-foreground">{a.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
};

export default Vaults;
