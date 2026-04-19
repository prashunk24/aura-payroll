import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GlowButton } from "@/components/GlowButton";
import { Vault, TrendingUp, PiggyBank, Plus, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState } from "react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/api";

const yieldData = [
  { m: "Nov", apy: 4.8, earned: 320 },
  { m: "Dec", apy: 5.0, earned: 410 },
  { m: "Jan", apy: 5.2, earned: 540 },
  { m: "Feb", apy: 5.4, earned: 690 },
  { m: "Mar", apy: 5.6, earned: 820 },
  { m: "Apr", apy: 5.42, earned: 910 },
];

const TaxVault = () => {
  const [amount, setAmount] = useState("");

  const action = (kind: "deposit" | "withdraw") => {
    if (!amount) return toast.error("Enter an amount");
    const path = kind === "deposit" ? API_ENDPOINTS.tax.deposit : API_ENDPOINTS.tax.withdraw;
    toast.success(`${kind === "deposit" ? "Deposited" : "Withdrew"} ${amount} USDC`, { description: `POST ${path}` });
    setAmount("");
  };

  return (
    <PageShell>
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tight">Tax <span className="text-gradient">Vault</span></h1>
        <p className="text-muted-foreground mt-2">Idle tax reserves earn yield through audited DeFi strategies.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Vault balance" value="$524,180" delta={6.4} icon={Vault} accent="primary" />
        <StatCard label="Current APY" value="5.42%" delta={0.4} icon={TrendingUp} accent="secondary" />
        <StatCard label="Yield earned (YTD)" value="$8,412" delta={12.8} icon={PiggyBank} accent="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Yield analytics</h2>
              <p className="text-xs text-muted-foreground">GET {API_ENDPOINTS.tax.yield}</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover) / 0.9)",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    backdropFilter: "blur(12px)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area type="monotone" dataKey="earned" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="apy" stroke="hsl(var(--secondary))" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard variant="strong">
          <h2 className="text-lg font-semibold mb-1">Treasury actions</h2>
          <p className="text-xs text-muted-foreground mb-5">Configurable via /api/tax/vault/*</p>
          <label className="text-xs text-muted-foreground">Amount (USDC)</label>
          <input
            type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="10000"
            className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <GlowButton onClick={() => action("deposit")}>
              <Plus className="w-4 h-4" /> Deposit
            </GlowButton>
            <GlowButton variant="outline" onClick={() => action("withdraw")}>
              <Minus className="w-4 h-4" /> Withdraw
            </GlowButton>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Strategy</span><span>Marginfi USDC</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Risk score</span><span className="text-secondary">Low</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Last rebalance</span><span>2h ago</span></div>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
};

export default TaxVault;
