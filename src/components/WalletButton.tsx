import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { WalletModal } from "./WalletModal";

interface WalletButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const WalletButton = ({ className, size = "md" }: WalletButtonProps) => {
  const { isConnected, status, short, walletIcon, disconnect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);

  const handle = async () => {
    if (isConnected) {
      try {
        await disconnect();
        toast.success("Wallet disconnected");
      } catch {
        toast.error("Failed to disconnect");
      }
      return;
    }
    setModalOpen(true);
  };

  const sizeClass =
    size === "sm" ? "px-4 py-2 text-sm" : size === "lg" ? "px-8 py-4 text-base" : "px-5 py-2.5 text-sm";

  return (
    <>
      <button
        onClick={handle}
        disabled={status === "connecting"}
        className={cn(
          "group relative inline-flex items-center gap-2 rounded-full font-medium",
          "glass-strong text-foreground",
          "transition-all duration-300",
          "hover:scale-[1.03] hover:shadow-[0_0_32px_hsl(var(--primary)/0.55)]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          sizeClass,
          className
        )}
      >
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"
          style={{ background: "var(--gradient-primary)", filter: "blur(20px)" }}
          aria-hidden
        />
        <span className="relative z-10 flex items-center gap-2">
          {status === "connecting" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isConnected ? (
            <LogOut className="w-4 h-4" />
          ) : walletIcon ? (
            <img src={walletIcon} alt="" className="w-4 h-4 rounded-sm" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          {status === "connecting" ? "Connecting…" : isConnected ? short : "Connect Wallet"}
        </span>
      </button>

      <WalletModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};
