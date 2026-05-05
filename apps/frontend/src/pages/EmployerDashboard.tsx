import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GlowButton } from "@/components/GlowButton";
import { Wallet, Users, Receipt, TrendingUp, Send, Plus, Settings2, Loader2, History, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/services/apiClient";
import { useWallet } from "@/hooks/useWallet";

const mockEmployees = [
  { id: "emp_01", name: "Ada Lovelace", role: "Engineering Lead", wallet: "8xK3...3aPq", salary: 6800 },
  { id: "emp_02", name: "Linus Torvalds", role: "Senior Engineer", wallet: "9zP7...7bQr", salary: 6200 },
  { id: "emp_03", name: "Grace Hopper", role: "Designer", wallet: "4hT2...9kMn", salary: 5400 },
  { id: "emp_04", name: "Alan Turing", role: "Researcher", wallet: "6yR8...1cVx", salary: 5800 },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { color: string, icon: any }> = {
    INITIATED: { color: "text-blue-400 bg-blue-400/10", icon: Clock },
    VALIDATED: { color: "text-purple-400 bg-purple-400/10", icon: Clock },
    PROCESSED: { color: "text-indigo-400 bg-indigo-400/10", icon: CheckCircle2 },
    TAX_WITHHELD: { color: "text-orange-400 bg-orange-400/10", icon: CheckCircle2 },
    YIELD_ACTIVE: { color: "text-green-400 bg-green-400/10", icon: TrendingUp },
    FAILED_VALIDATION: { color: "text-red-400 bg-red-400/10", icon: AlertCircle },
    FAILED_EXECUTION: { color: "text-red-400 bg-red-400/10", icon: AlertCircle },
  };

  const config = styles[status] || { color: "text-slate-400 bg-slate-400/10", icon: Clock };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ')}
    </span>
  );
};

const EmployerDashboard = () => {
  const { isConnected } = useWallet();
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [taxRate, setTaxRate] = useState("18");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const fetchRecords = async () => {
    if (!isConnected) return;
    setIsLoadingRecords(true);
    try {
      const token = localStorage.getItem('auth_token') || 'dummy-token';
      const data = await api.get<any[]>('/api/payroll/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 5000); 
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return toast.error("Please connect your wallet first");
    if (!employeeId || !amount) return toast.error("Fill recipient and amount");

    setIsSubmitting(true);
    const loadingToast = toast.loading("Processing payroll batch...");

    try {
      const token = localStorage.getItem('auth_token') || 'dummy-token';
      const result = await api.post<any>('/api/payroll/run', {
        employeeId,
        amount: parseFloat(amount),
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success("Payroll run initiated!", {
        id: loadingToast,
        description: `Record created with status: ${result.status}. The background engine is now processing taxes and yield.`,
      });

      setEmployeeId("");
      setAmount("");
      fetchRecords();
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to initiate payroll", {
        id: loadingToast,
        description: error.message || "The backend might be offline or unauthorized.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tight">Employer <span className="text-gradient">Dashboard</span></h1>
        <p className="text-muted-foreground mt-2">Manage payroll, tax, and treasury yield in one place.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Monthly payroll" value="$184,200" delta={4.2} icon={Wallet} accent="primary" />
        <StatCard label="Tax withheld" value="$33,156" delta={4.2} icon={Receipt} accent="accent" />
        <StatCard label="Vault yield (YTD)" value="$8,412" delta={12.8} icon={TrendingUp} accent="secondary" />
        <StatCard label="Active employees" value="44" delta={2.3} icon={Users} accent="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold">Employees</h2>
              <p className="text-xs text-muted-foreground">Manage your team and distribution.</p>
            </div>
            <GlowButton variant="ghost" size="sm">
              <Plus className="w-4 h-4" /> Add
            </GlowButton>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-white/10">
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Wallet</th>
                  <th className="py-3 pr-4 font-medium text-right">Salary</th>
                  <th className="py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockEmployees.map((e) => (
                  <tr key={e.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.role}</div>
                    </td>
                    <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">{e.wallet}</td>
                    <td className="py-4 pr-4 text-right font-semibold">${e.salary.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => { setEmployeeId(e.id); setAmount(e.salary.toString()); }}
                        className="text-xs text-secondary hover:underline"
                      >
                        Pay now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard variant="strong">
          <h2 className="text-lg font-semibold mb-1">Send payment</h2>
          <p className="text-xs text-muted-foreground mb-5">POST /api/payroll/run</p>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Select Employee</label>
              <select 
                value={employeeId} 
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition bg-transparent"
              >
                <option value="" disabled className="bg-slate-900">Choose an employee...</option>
                {mockEmployees.map(emp => (
                  <option key={emp.id} value={emp.id} className="bg-slate-900">{emp.name} ({emp.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amount (USDC)</label>
              <input
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="2500"
                className="mt-1 w-full glass-subtle rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>
            <GlowButton type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSubmitting ? "Processing..." : "Sign & Send"}
            </GlowButton>
          </form>
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Payroll Activity</h2>
                <p className="text-sm text-muted-foreground">Real-time status of intelligent financial flows.</p>
              </div>
            </div>
            <GlowButton variant="ghost" size="sm" onClick={fetchRecords} disabled={isLoadingRecords}>
              {isLoadingRecords ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
            </GlowButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-white/10">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Net Amount</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Yield Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted-foreground">
                      {isConnected ? "No payroll history found. Start by sending a payment." : "Connect wallet to view activity."}
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="font-medium">{r.employee?.name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground font-mono">{r.transactionHash?.slice(0, 8) || 'Pending...'}</div>
                      </td>
                      <td className="py-4 font-semibold">
                        ${r.amount.toLocaleString()} <span className="text-[10px] text-muted-foreground">USDC</span>
                      </td>
                      <td className="py-4 text-center">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-xs px-2 py-0.5 rounded border border-white/10 bg-white/5 text-muted-foreground">
                          STABLE
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-accent">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tax settings</h2>
            <p className="text-xs text-muted-foreground">Configure your global withholding and yield rules.</p>
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
