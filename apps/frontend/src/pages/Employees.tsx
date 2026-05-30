import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { Plus, Search, MoreHorizontal, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { useWallet } from "@/hooks/useWallet";
import { AddEmployeeModal } from "@/components/AddEmployeeModal";

const initials = (n: string) => n.split(" ").map(p => p[0]).slice(0, 2).join("");

const Employees = () => {
  const { isConnected } = useWallet();
  const [q, setQ] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const fetchEmployees = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    try {
      const data = await api.get<any[]>(API_ENDPOINTS.employees.list);
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [isConnected]);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(q.toLowerCase()) || 
    e.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <DashboardShell
      title="Employees"
      subtitle="Manage your team, salaries, and tax preferences."
      actions={
        <GlowButton onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" />
          Add employee
        </GlowButton>
      }
    >
      <AddEmployeeModal open={addOpen} onOpenChange={setAddOpen} onAdded={fetchEmployees} />
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
              {isLoading ? (
                <tr><td colSpan={6} className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto opacity-20" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">{isConnected ? "No employees found." : "Connect wallet to view team."}</td></tr>
              ) : (
                filtered.map((e) => (
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
                    <td className="py-4 pr-4 text-muted-foreground hidden md:table-cell">Team Member</td>
                    <td className="py-4 pr-4 text-right font-semibold">${e.salary ? e.salary.toLocaleString() : "0"}</td>
                    <td className="py-4 pr-4 text-right text-muted-foreground hidden sm:table-cell">{e.region || "IN"}</td>
                    <td className="py-4 pr-4 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                        Active
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-foreground/5 text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardShell>
  );
};

export default Employees;
