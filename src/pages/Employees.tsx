import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { Plus, Search, MoreHorizontal, Filter } from "lucide-react";
import { useState } from "react";

const employees = [
  { id: "emp_01", name: "Ada Lovelace", email: "ada@acme.co", role: "Engineering Lead", salary: 6800, tax: 18, status: "Active" },
  { id: "emp_02", name: "Linus Torvalds", email: "linus@acme.co", role: "Senior Engineer", salary: 6200, tax: 18, status: "Active" },
  { id: "emp_03", name: "Grace Hopper", email: "grace@acme.co", role: "Product Designer", salary: 5400, tax: 16, status: "Active" },
  { id: "emp_04", name: "Alan Turing", email: "alan@acme.co", role: "Researcher", salary: 5800, tax: 18, status: "Active" },
  { id: "emp_05", name: "Margaret Hamilton", email: "margaret@acme.co", role: "Engineering Mgr", salary: 7200, tax: 20, status: "Active" },
  { id: "emp_06", name: "Donald Knuth", email: "knuth@acme.co", role: "Principal", salary: 8100, tax: 22, status: "On leave" },
];

const initials = (n: string) => n.split(" ").map(p => p[0]).slice(0, 2).join("");

const Employees = () => {
  const [q, setQ] = useState("");
  const filtered = employees.filter(e => e.name.toLowerCase().includes(q.toLowerCase()) || e.email.includes(q.toLowerCase()));

  return (
    <DashboardShell
      title="Employees"
      subtitle="Manage your team, salaries, and tax preferences."
      actions={
        <GlowButton>
          <Plus className="w-4 h-4" /> Add employee
        </GlowButton>
      }
    >
      <GlassCard>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="glass-subtle flex-1 rounded-xl flex items-center gap-2 h-10 px-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email…"
              className="bg-transparent outline-none text-sm flex-1 min-w-0"
            />
          </div>
          <button className="glass-subtle h-10 px-4 rounded-xl text-sm font-medium inline-flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                <th className="py-3 pr-4 font-semibold">Employee</th>
                <th className="py-3 pr-4 font-semibold hidden md:table-cell">Role</th>
                <th className="py-3 pr-4 font-semibold text-right">Salary</th>
                <th className="py-3 pr-4 font-semibold text-right hidden sm:table-cell">Tax</th>
                <th className="py-3 pr-4 font-semibold hidden lg:table-cell">Status</th>
                <th className="py-3 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
                        {initials(e.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{e.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground hidden md:table-cell">{e.role}</td>
                  <td className="py-4 pr-4 text-right font-semibold">${e.salary.toLocaleString()}</td>
                  <td className="py-4 pr-4 text-right text-muted-foreground hidden sm:table-cell">{e.tax}%</td>
                  <td className="py-4 pr-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${e.status === "Active" ? "text-foreground" : "text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${e.status === "Active" ? "bg-foreground" : "bg-muted-foreground"}`} />
                      {e.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-foreground/5 text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardShell>
  );
};

export default Employees;
