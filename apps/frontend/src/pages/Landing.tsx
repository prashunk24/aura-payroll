import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, TrendingUp, Receipt, Users, FileText, PlayCircle } from "lucide-react";
import { SalarySplitFlow } from "@/components/SalarySplitFlow";

const features = [
  { icon: PlayCircle, title: "One-click payroll", desc: "Run global payroll in seconds. Confirm, sign, done." },
  { icon: Receipt, title: "Automatic tax", desc: "Withhold the right amount and route it straight to your vault." },
  { icon: TrendingUp, title: "Treasury yield", desc: "Idle reserves earn up to 5.4% APY through low-risk strategies." },
  { icon: Users, title: "Team management", desc: "Add employees, set salaries, manage tax preferences in one place." },
  { icon: FileText, title: "Compliance reports", desc: "Generate filings and PDFs for any period, instantly." },
  { icon: Shield, title: "Bank-grade security", desc: "Funds stay yours. End-to-end encryption, audited infrastructure." },
];

const Landing = () => {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative pt-6 sm:pt-10 md:pt-20 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          <div className="lg:col-span-7 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 glass-subtle rounded-full px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground border border-foreground/10">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              Modern payroll, made simple
            </span>
            <h1 className="mt-5 sm:mt-6 text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
              Payroll that <span className="text-gradient">runs itself</span>.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              AuraPayroll automates salaries, tax withholding, and treasury yield — in one
              clean dashboard built for HR teams and founders.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link to="/app">
                <GlowButton size="lg">
                  Open dashboard <ArrowRight className="w-4 h-4" />
                </GlowButton>
              </Link>
              <GlowButton variant="outline" size="lg">
                Watch demo
              </GlowButton>
            </div>

            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-md">
              {[
                { v: "$24M+", l: "Paid out" },
                { v: "12k", l: "Employees paid" },
                { v: "5.4%", l: "Avg vault APY" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-xl sm:text-2xl font-semibold text-gradient">{s.v}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero glass card */}
          <div className="lg:col-span-5 relative">
            <div>
              <GlassCard variant="strong" glow="primary">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Next payroll</p>
                    <p className="mt-1 text-2xl sm:text-3xl font-semibold truncate">$184,200</p>
                  </div>
                  <span className="rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs bg-foreground text-background font-medium shrink-0">
                    In 2d 14h
                  </span>
                </div>

                <SalarySplitFlow total={184200} taxRate={18} />

                <div className="mt-6">
                  <Link to="/app/payroll">
                    <GlowButton className="w-full">
                      <PlayCircle className="w-4 h-4" /> Run payroll
                    </GlowButton>
                  </Link>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Built for <span className="text-gradient">finance teams</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Everything you need to run payroll, automate tax, and grow your treasury.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <GlassCard key={f.title} hover delay={i * 0.05}>
              <div className="w-11 h-11 rounded-2xl bg-foreground text-background flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20">
        <div className="ink-panel rounded-3xl text-center py-12 sm:py-16 px-5 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" aria-hidden />
          <h3 className="relative text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-gradient-invert">
            Pay your team in 60 seconds.
          </h3>
          <p className="relative mt-3 sm:mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
            Add your employees, set salaries, run payroll. That's it.
          </p>
          <div className="relative mt-6 sm:mt-8 flex justify-center">
            <Link to="/app">
              <GlowButton size="lg" className="bg-background text-foreground">
                Get started <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Landing;
