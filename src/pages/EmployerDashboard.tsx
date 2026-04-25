import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GlowButton } from "@/components/GlowButton";
import { Wallet, Users, Receipt, TrendingUp, Send, Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/api";

const mockEmployees = [
  { id: "emp_01", name: "Ada Lovelace", role: "Engineering Lead", wallet: "8xK3...3aPq", salary: 6800 },
  { id: "emp_02", name: "Linus Torvalds", role: "Senior Engineer", wallet: "9zP7...7bQr", salary: 6200 },
  { id: "emp_03", name: "Grace Hopper", role: "Designer", wallet: "4hT2...9kMn", salary: 5400 },
  { id: "emp_04", name: "Alan Turing", role: "Researcher", wallet: "6yR8...1cVx", salary: 5800 },
];

const EmployerDashboard = () => {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [taxRate, setTaxRate] = useState("18");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !amount) return toast.error("Fill wallet and amount");
    toast.success(`Queued ${amount} USDC → ${wallet.slice(0,6)}…`, {
      description: `POST ${API_ENDPOINTS.payroll.send}`,
    });
    setWallet(""); setAmount("");
  };

  return (
    <PageShell>
      <div className="mb-8 sm:mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Employer <span className="text-gradient">Dashboard</span></h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage payroll, tax, and treasury yield in one place.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <StatCard label="Monthly payroll" value="$184,200" delta={4.2} icon={Wallet} accent="primary" />
        <StatCard label="Tax withheld" value="$33,156" delta={4.2} icon={Receipt} accent="accent" />
        <StatCard label="Vault yield (YTD)" value="$8,412" delta={12.8} icon={TrendingUp} accent="secondary" />
        <StatCard label="Active employees" value="44" delta={2.3} icon={Users} accent="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Employees */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold">Employees</h2>
              <p className="text-xs text-muted-foreground">GET {API_ENDPOINTS.employees.list}</p>
            </div>
            <GlowButton variant="ghost" size="sm">
              <Plus className="w-4 h-4" /> Add
            </GlowButton>
          </div>
          <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium hidden sm:table-cell">Wallet</th>
                  <th className="py-3 pr-4 font-medium text-right">Salary</th>
                  <th className="py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockEmployees.map((e) => (
                  <tr key={e.id} className="border-b border-foreground/5 hover:bg-foreground/[0.03] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.role}</div>
                    </td>
                    <td className="py-4 pr-4 font-mono text-xs text-muted-foreground hidden sm:table-cell">{e.wallet}</td>
                    <td className="py-4 pr-4 text-right font-semibold">${e.salary.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <button className="text-xs font-semibold text-foreground hover:underline underline-offset-4">Pay now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Payment form */}
        <GlassCard variant="strong">
          <h2 className="text-lg font-semibold mb-1">Send payment</h2>
          <p className="text-xs text-muted-foreground mb-5">POST {API_ENDPOINTS.payroll.send}</p>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Recipient wallet</label>
              <input
                value={wallet} onChange={(e) => setWallet(e.target.value)}
                placeholder="8xK3…3aPq"
                className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amount (USDC)</label>
              <input
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="2500"
                className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
            <GlowButton type="submit" className="w-full">
              <Send className="w-4 h-4" /> Sign & Send
            </GlowButton>
          </form>
        </GlassCard>
      </div>

      {/* Tax settings */}
      <GlassCard className="mt-4 sm:mt-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tax settings</h2>
            <p className="text-xs text-muted-foreground">PUT {API_ENDPOINTS.tax.settings}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Withholding rate (%)</label>
            <input
              value={taxRate} onChange={(e) => setTaxRate(e.target.value)}
              className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Jurisdiction</label>
            <select className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/50">
              <option>United States</option><option>EU</option><option>UK</option><option>Singapore</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Auto-deposit to vault</label>
            <select className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/50">
              <option>Enabled</option><option>Disabled</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <GlowButton variant="outline" onClick={() => toast.success("Tax settings saved")}>Save settings</GlowButton>
        </div>
      </GlassCard>
    </PageShell>
  );
};

export default EmployerDashboard;
