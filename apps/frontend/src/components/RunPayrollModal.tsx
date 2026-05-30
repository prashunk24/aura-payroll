import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GlowButton } from "./GlowButton";
import { SalarySplitFlow } from "./SalarySplitFlow";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { useWallet } from "@/hooks/useWallet";
import { Transaction } from "@solana/web3.js";

interface RunPayrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  employees: number;
  taxRate: number;
}

type Step = "preview" | "running" | "success";

export const RunPayrollModal = ({ open, onOpenChange, total, employees, taxRate }: RunPayrollModalProps) => {
  const { isConnected, isMock, signTransaction, sendTransaction } = useWallet();
  const [step, setStep] = useState<Step>("preview");

  const reset = (val: boolean) => {
    onOpenChange(val);
    if (!val) setTimeout(() => setStep("preview"), 250);
  };

  const run = async () => {
    if (!isConnected || !signTransaction || !sendTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    setStep("running");
    
    try {
      const employeesToPay = await api.get<any[]>(API_ENDPOINTS.employees.list);

      if (employeesToPay.length === 0) {
        throw new Error("No employees found to pay");
      }

      const employeeIds = employeesToPay.map(e => e.id).join(',');

      const batch = await api.get<any[]>(
        `${API_ENDPOINTS.payroll.prepareBatch}?employeeIds=${employeeIds}`
      );

      let lastSignature = "";

      for (const item of batch) {
        const tx = Transaction.from(Buffer.from(item.transaction, 'base64'));
        const signedTx = await signTransaction(tx);
        
        const connection = (window as any).solana?.connection || {}; 
        const signature = await sendTransaction(signedTx, connection);
        lastSignature = signature;

        await api.post<any>(API_ENDPOINTS.payroll.run, {
          employeeId: item.employeeId,
          amount: item.amount,
          signature,
        });
      }

      setStep("success");
      toast.success("Payroll batch completed", {
        description: (
          <div className="flex flex-col gap-1 mt-1">
            <span>{batch.length} employees paid successfully.</span>
            {lastSignature && (
              <a 
                href={`https://explorer.solana.com/tx/${lastSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-primary underline underline-offset-2 hover:opacity-80 break-all"
              >
                {lastSignature}
              </a>
            )}
          </div>
        ) as any
      });
    } catch (error: any) {
      console.error(error);
      setStep("preview");
      toast.error("Execution failed", {
        description: error.message || "Wallet signature denied or backend offline."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="max-w-2xl rounded-3xl glass-strong border-foreground/10 p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              <DialogHeader className="text-left mb-6">
                <DialogTitle className="text-2xl tracking-tight">Confirm payroll</DialogTitle>
                <DialogDescription>
                  Review the breakdown before sending. Funds will be distributed instantly.
                </DialogDescription>
              </DialogHeader>

              <SalarySplitFlow total={total} taxRate={taxRate} />

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="glass-subtle rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Recipients</p>
                  <p className="text-sm font-semibold mt-1">{employees}</p>
                </div>
                <div className="glass-subtle rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tax rate</p>
                  <p className="text-sm font-semibold mt-1">{taxRate}%</p>
                </div>
                <div className="glass-subtle rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Settlement</p>
                  <p className="text-sm font-semibold mt-1">~ Instant</p>
                </div>
              </div>

              <div className="mt-7 flex gap-3 justify-end">
                <GlowButton variant="outline" onClick={() => reset(false)}>
                  Cancel
                </GlowButton>
                <GlowButton onClick={run}>
                  Confirm & Pay <ArrowRight className="w-4 h-4" />
                </GlowButton>
              </div>
            </motion.div>
          )}

          {step === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 sm:p-16 flex flex-col items-center text-center"
            >
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="mt-5 text-lg font-semibold">Processing payroll…</p>
              <p className="text-sm text-muted-foreground mt-1">Distributing funds to {employees} recipients.</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-10 sm:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="mx-auto w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center"
              >
                <Check className="w-7 h-7" strokeWidth={3} />
              </motion.div>
              <p className="mt-5 text-2xl font-semibold tracking-tight">Payroll completed</p>
              <p className="text-sm text-muted-foreground mt-1.5">
                {employees} employees paid · {taxRate}% routed to your tax vault.
              </p>
              <div className="mt-7">
                <GlowButton onClick={() => reset(false)}>Done</GlowButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
