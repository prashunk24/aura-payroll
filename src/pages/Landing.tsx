import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { WalletButton } from "@/components/WalletButton";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, TrendingUp, Globe, Lock, Coins } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Payroll", desc: "Settle global salaries in seconds via Solana — fees under a cent." },
  { icon: Shield, title: "Auto Tax Vault", desc: "Deductions stream into a yield-earning vault, fully transparent on-chain." },
  { icon: TrendingUp, title: "Yield Optimization", desc: "Idle treasury earns up to 7% APY through audited DeFi strategies." },
  { icon: Globe, title: "Borderless", desc: "Pay anyone, anywhere. No banks, no FX markup, no delays." },
  { icon: Lock, title: "Non-Custodial", desc: "Funds never leave your wallet until you sign. Always your keys." },
  { icon: Coins, title: "Multi-Asset", desc: "USDC, SOL, and SPL tokens — pay in whatever your team prefers." },
];

const Landing = () => {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative pt-10 md:pt-20 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 glass-subtle rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground border border-foreground/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live on Solana mainnet
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Payroll, <span className="text-gradient">reinvented</span> on-chain.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              SolPay automates global salaries, tax withholding, and treasury yield — in one
              non-custodial dashboard built on Solana.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <WalletButton size="lg" />
              <Link to="/employer">
                <GlowButton variant="outline" size="lg">
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </GlowButton>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "$24M+", l: "Settled" },
                { v: "12k", l: "Wallets paid" },
                { v: "0.0004s", l: "Avg finality" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-bold text-gradient">{s.v}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero glass card */}
          <div className="lg:col-span-5 relative animate-scale-in">
            <div className="float">
              <GlassCard variant="strong" glow="primary" className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Next Payroll</p>
                    <p className="mt-1 text-3xl font-bold">$184,200<span className="text-base text-muted-foreground"> USDC</span></p>
                  </div>
                  <span className="glass-subtle rounded-full px-3 py-1 text-xs text-secondary">In 2h 14m</span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { name: "Engineering", count: 24, amt: 92400 },
                    { name: "Design", count: 8, amt: 38000 },
                    { name: "Operations", count: 12, amt: 53800 },
                  ].map((d) => (
                    <div key={d.name} className="glass-subtle rounded-2xl p-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{d.name}</span>
                        <span className="text-muted-foreground">{d.count} wallets</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex-1 h-1.5 rounded-full bg-foreground/5 mr-3 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(d.amt/92400)*100}%` }} />
                        </div>
                        <span className="text-sm font-semibold">${d.amt.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <GlowButton className="w-full">
                    Sign & Send <ArrowRight className="w-4 h-4" />
                  </GlowButton>
                </div>
              </GlassCard>
            </div>

            {/* Floating mini cards */}
            <GlassCard variant="subtle" className="absolute -top-6 -left-10 hidden md:block float" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vault APY</p>
                  <p className="text-sm font-bold">+5.42%</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built for the <span className="text-gradient">on-chain era</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything finance teams need — composable, transparent, programmable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <GlassCard key={f.title} hover className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary glow-primary flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <GlassCard variant="strong" glow="primary" className="text-center py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-primary)", filter: "blur(80px)" }} />
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight">Pay your team in 60 seconds.</h3>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Connect your Solana wallet, import employees, send payroll. That's it.
          </p>
          <div className="mt-8 flex justify-center">
            <WalletButton size="lg" />
          </div>
        </GlassCard>
      </section>
    </PageShell>
  );
};

export default Landing;
