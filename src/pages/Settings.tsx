import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Percent, CreditCard, Bell } from "lucide-react";

const Sect = ({ icon: Icon, title, desc, children }: { icon: typeof Building2; title: string; desc: string; children: React.ReactNode }) => (
  <GlassCard>
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
    {children}
  </GlassCard>
);

const Field = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="block">
    <span className="text-xs text-muted-foreground">{label}</span>
    <input
      {...props}
      className="mt-1.5 w-full glass-subtle rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
    />
  </label>
);

const Settings = () => {
  return (
    <DashboardShell title="Settings" subtitle="Company info, tax rules, and payment preferences.">
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <Sect icon={Building2} title="Company" desc="Used on reports and invoices.">
          <div className="space-y-3">
            <Field label="Company name" defaultValue="Acme, Inc." />
            <Field label="Tax ID" defaultValue="EIN-12-3456789" />
            <Field label="Country" defaultValue="United States" />
            <GlowButton onClick={() => toast.success("Company info saved")} className="mt-2">Save changes</GlowButton>
          </div>
        </Sect>

        <Sect icon={Percent} title="Tax rules" desc="Default rates applied to new employees.">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Default rate (%)" defaultValue="18" />
            <Field label="Bonus rate (%)" defaultValue="22" />
          </div>
          <div className="mt-3">
            <label className="text-xs text-muted-foreground">Auto-deposit to vault</label>
            <select className="mt-1.5 w-full glass-subtle rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
              <option>Enabled · earn yield on idle reserves</option>
              <option>Disabled · keep in operating account</option>
            </select>
          </div>
          <GlowButton onClick={() => toast.success("Tax rules saved")} className="mt-4">Save changes</GlowButton>
        </Sect>

        <Sect icon={CreditCard} title="Payment preferences" desc="How payroll is funded and paid out.">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Default funding source</label>
              <select className="mt-1.5 w-full glass-subtle rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
                <option>Acme Operating · ****4129</option>
                <option>Card · Visa ****8821</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Payment schedule</label>
              <select className="mt-1.5 w-full glass-subtle rounded-xl px-4 h-11 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
                <option>Monthly · 1st of every month</option>
                <option>Bi-weekly</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>
        </Sect>

        <Sect icon={Bell} title="Notifications" desc="Stay informed about activity.">
          <div className="space-y-3">
            {[
              { label: "Payroll completed", on: true },
              { label: "Low treasury balance", on: true },
              { label: "Failed payments", on: true },
              { label: "Yield distributions", on: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between glass-subtle rounded-xl p-3.5">
                <span className="text-sm font-medium">{n.label}</span>
                <input type="checkbox" defaultChecked={n.on} className="w-9 h-5 accent-foreground" />
              </label>
            ))}
          </div>
        </Sect>
      </div>
    </DashboardShell>
  );
};

export default Settings;
