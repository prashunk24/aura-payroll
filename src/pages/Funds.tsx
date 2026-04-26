import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDownToLine, ArrowUpFromLine, Building2, CreditCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Funds = () => {
  const [mode, setMode] = useState<"add" | "withdraw">("add");
  const [amount, setAmount] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return toast.error("Enter an amount");
    toast.success(`${mode === "add" ? "Funds added" : "Withdrawal initiated"}: $${amount}`);
    setAmount("");
  };

  return (
    <DashboardShell title="Funds" subtitle="Top up your treasury or withdraw to your bank — fast and simple.">
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <GlassCard variant="strong" className="lg:col-span-2">
          <div className="flex gap-2 mb-6">
            {(["add", "withdraw"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "h-10 px-5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-colors",
                  mode === m ? "bg-foreground text-background" : "glass-subtle text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "add" ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                {m === "add" ? "Add funds" : "Withdraw"}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <label className="text-xs text-muted-foreground">Amount</label>
            <div className="mt-2 relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">$</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
                className="w-full glass-subtle rounded-2xl pl-12 pr-4 h-20 text-3xl font-semibold outline-none focus:ring-2 focus:ring-foreground/30"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {["1,000", "5,000", "25,000", "100,000"].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.replace(/,/g, ""))}
                  className="px-3 h-8 rounded-lg text-xs font-medium glass-subtle hover:bg-foreground/5"
                >
                  ${q}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">Source</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 glass-subtle rounded-xl p-3.5 cursor-pointer">
                  <input type="radio" name="src" defaultChecked className="accent-foreground" />
                  <Building2 className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bank transfer · Acme Operating</p>
                    <p className="text-xs text-muted-foreground">****4129 · arrives in seconds</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 glass-subtle rounded-xl p-3.5 cursor-pointer">
                  <input type="radio" name="src" className="accent-foreground" />
                  <CreditCard className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Card · Visa</p>
                    <p className="text-xs text-muted-foreground">****8821 · 1.5% fee</p>
                  </div>
                </label>
              </div>
            </div>

            <GlowButton type="submit" className="w-full mt-6">
              {mode === "add" ? "Add to treasury" : "Withdraw to bank"}
            </GlowButton>
          </form>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <p className="text-xs text-muted-foreground">Treasury balance</p>
            <p className="text-3xl font-semibold tracking-tight mt-1">$1,284,920</p>
            <p className="text-xs text-muted-foreground mt-1.5">Available · ready to spend</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">Linked accounts</p>
              <button className="text-xs font-medium hover:underline underline-offset-4 inline-flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Acme Operating", sub: "****4129", icon: Building2 },
                { label: "Visa · Personal", sub: "****8821", icon: CreditCard },
              ].map((a) => (
                <div key={a.sub} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center">
                    <a.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Funds;
