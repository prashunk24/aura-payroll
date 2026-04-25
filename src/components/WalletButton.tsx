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
    size === "sm"
      ? "px-3 sm:px-4 py-2 text-xs sm:text-sm"
      : size === "lg"
      ? "px-8 py-4 text-base"
      : "px-5 py-2.5 text-sm";

  return (
    <>
      <button
        onClick={handle}
        disabled={status === "connecting"}
        className={cn(
          "group relative inline-flex items-center gap-2 rounded-full font-medium shrink-0 max-w-full",
          isConnected
            ? "glass-strong text-foreground border border-foreground/10"
            : "bg-primary text-primary-foreground",
          "transition-all duration-300",
          "hover:scale-[1.02] hover:shadow-[0_12px_40px_-8px_hsl(0_0%_0%/0.45)]",
          "shadow-[0_6px_20px_-6px_hsl(0_0%_0%/0.25)]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          sizeClass,
          className
        )}
      >
        <span className="relative z-10 flex items-center gap-2 min-w-0">
          {status === "connecting" ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          ) : isConnected ? (
            <LogOut className="w-4 h-4 shrink-0" />
          ) : walletIcon ? (
            <img src={walletIcon} alt="" className="w-4 h-4 rounded-sm shrink-0" />
          ) : (
            <Wallet className="w-4 h-4 shrink-0" />
          )}
          <span className="truncate">
            {status === "connecting"
              ? "Connecting…"
              : isConnected
              ? short
              : (
                <>
                  <span className="sm:hidden">Connect</span>
                  <span className="hidden sm:inline">Connect Wallet</span>
                </>
              )}
          </span>
        </span>
      </button>

      <WalletModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};
