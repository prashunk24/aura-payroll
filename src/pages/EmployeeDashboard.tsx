import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { Wallet, Receipt, Gift, ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";

const txs = [
  { id: "tx_001", type: "Salary", amt: 5400, date: "Apr 1, 2025", from: "Acme DAO", status: "Confirmed" },
  { id: "tx_002", type: "Bonus",  amt: 800,  date: "Apr 1, 2025", from: "Acme DAO", status: "Confirmed" },
  { id: "tx_003", type: "Tax",    amt: -972, date: "Apr 1, 2025", from: "Tax Vault", status: "Confirmed" },
  { id: "tx_004", type: "Salary", amt: 5400, date: "Mar 1, 2025", from: "Acme DAO", status: "Confirmed" },
  { id: "tx_005", type: "Tax",    amt: -972, date: "Mar 1, 2025", from: "Tax Vault", status: "Confirmed" },
];

const EmployeeDashboard = () => (
  <PageShell>
    <div className="mb-10 animate-fade-in-up">
      <h1 className="text-4xl font-bold tracking-tight">My <span className="text-gradient">Earnings</span></h1>
      <p className="text-muted-foreground mt-2">Track salary, tax, and bonuses paid to your wallet.</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-5 mb-8">
      <StatCard label="Salary received (YTD)" value="$21,600" delta={0} icon={Wallet} accent="primary" />
      <StatCard label="Tax deducted" value="$3,888" delta={0} icon={Receipt} accent="accent" />
      <StatCard label="Bonus earned" value="$1,400" delta={20} icon={Gift} accent="secondary" />
    </div>

    <GlassCard>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">Transaction history</h2>
          <p className="text-xs text-muted-foreground">GET {API_ENDPOINTS.transactions.list}</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 pr-4 font-medium">From</th>
              <th className="py-3 pr-4 font-medium">Date</th>
              <th className="py-3 pr-4 font-medium text-right">Amount</th>
              <th className="py-3 font-medium text-right">Tx</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-b border-foreground/5 hover:bg-foreground/[0.03] transition-colors">
                <td className="py-4 pr-4">
                  <span className="inline-flex items-center gap-2">
                    {t.amt >= 0 ? (
                      <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-lg bg-muted text-foreground flex items-center justify-center border border-border">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {t.type}
                  </span>
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{t.from}</td>
                <td className="py-4 pr-4 text-muted-foreground">{t.date}</td>
                <td className={`py-4 pr-4 text-right font-semibold ${t.amt >= 0 ? "text-foreground" : "text-muted-foreground"}`}>
                  {t.amt >= 0 ? "+" : ""}${Math.abs(t.amt).toLocaleString()}
                </td>
                <td className="py-4 text-right">
                  <a className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline underline-offset-4" href="#">
                    {t.id} <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  </PageShell>
);

export default EmployeeDashboard;
