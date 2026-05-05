import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { Wallet, Receipt, Gift, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const txs = [
  { id: "tx_001", type: "Salary", amt: 5400, date: "Apr 1, 2025", from: "Acme, Inc." },
  { id: "tx_002", type: "Bonus", amt: 800, date: "Apr 1, 2025", from: "Acme, Inc." },
  { id: "tx_003", type: "Tax withheld", amt: -972, date: "Apr 1, 2025", from: "Tax vault" },
  { id: "tx_004", type: "Salary", amt: 5400, date: "Mar 1, 2025", from: "Acme, Inc." },
  { id: "tx_005", type: "Tax withheld", amt: -972, date: "Mar 1, 2025", from: "Tax vault" },
];

const EmployeeDashboard = () => (
  <DashboardShell title="My earnings" subtitle="Track every salary, bonus, and tax contribution paid to you.">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      <StatCard label="Salary received (YTD)" value="$21,600" delta={0} icon={Wallet} />
      <StatCard label="Tax contributed" value="$3,888" delta={0} icon={Receipt} />
      <StatCard label="Bonus earned" value="$1,400" delta={20} icon={Gift} />
    </div>

    <GlassCard>
      <h2 className="text-base font-semibold mb-4">Transaction history</h2>
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
              <th className="py-3 pr-4 font-semibold">Type</th>
              <th className="py-3 pr-4 font-semibold hidden sm:table-cell">From</th>
              <th className="py-3 pr-4 font-semibold">Date</th>
              <th className="py-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02]">
                <td className="py-4 pr-4">
                  <span className="inline-flex items-center gap-2.5">
                    {t.amt >= 0 ? (
                      <span className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-lg bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-medium">{t.type}</span>
                  </span>
                </td>
                <td className="py-4 pr-4 text-muted-foreground hidden sm:table-cell">{t.from}</td>
                <td className="py-4 pr-4 text-muted-foreground">{t.date}</td>
                <td className={`py-4 text-right font-semibold ${t.amt >= 0 ? "text-foreground" : "text-muted-foreground"}`}>
                  {t.amt >= 0 ? "+" : "−"}${Math.abs(t.amt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  </DashboardShell>
);

export default EmployeeDashboard;
