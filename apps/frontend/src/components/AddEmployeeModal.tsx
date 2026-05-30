import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GlowButton } from "./GlowButton";
import { toast } from "sonner";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { useWallet } from "@/hooks/useWallet";
import { Loader2 } from "lucide-react";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
}

export const AddEmployeeModal = ({ open, onOpenChange, onAdded }: AddEmployeeModalProps) => {
  const { isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [region, setRegion] = useState("IN");
  const [salary, setSalary] = useState("1000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.employees.add, {
        name,
        email,
        walletAddress,
        region,
        salary: parseFloat(salary) || 0
      });
      toast.success("Employee added successfully");
      onAdded();
      onOpenChange(false);
      setName("");
      setEmail("");
      setWalletAddress("");
      setRegion("IN");
      setSalary("1000");
    } catch (error: any) {
      toast.error("Failed to add employee", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border-foreground/10 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>Register a new team member to your payroll.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Full Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full h-10 px-3 rounded-xl glass-subtle text-sm outline-none focus:ring-1 focus:ring-foreground/20" placeholder="Satoshi Nakamoto" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Email Address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-xl glass-subtle text-sm outline-none focus:ring-1 focus:ring-foreground/20" placeholder="satoshi@example.com" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Solana Wallet Address</label>
            <input required value={walletAddress} onChange={e => setWalletAddress(e.target.value)} className="w-full h-10 px-3 rounded-xl glass-subtle text-sm outline-none focus:ring-1 focus:ring-foreground/20" placeholder="Base58 Public Key" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Base Salary (USDC)</label>
              <input required type="number" min="0" step="0.01" value={salary} onChange={e => setSalary(e.target.value)} className="w-full h-10 px-3 rounded-xl glass-subtle text-sm outline-none focus:ring-1 focus:ring-foreground/20" placeholder="1000" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tax Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} className="w-full h-10 px-3 rounded-xl glass-subtle text-sm outline-none focus:ring-1 focus:ring-foreground/20 bg-transparent">
                <option value="IN">India (IN)</option>
                <option value="US">United States (US)</option>
                <option value="UK">United Kingdom (UK)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <GlowButton className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Employee"}
            </GlowButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
