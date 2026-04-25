import { useWallet } from "@solana/wallet-adapter-react";
import { Wallet as WalletIcon, X, Loader2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { WalletReadyState } from "@solana/wallet-adapter-base";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletModal = ({ open, onOpenChange }: WalletModalProps) => {
  const { wallets, select, connect } = useWallet();
  const [pending, setPending] = useState<string | null>(null);

  const { detected, more } = useMemo(() => {
    const installed = wallets.filter(
      (w) =>
        w.readyState === WalletReadyState.Installed ||
        w.readyState === WalletReadyState.Loadable
    );
    const others = wallets.filter(
      (w) =>
        w.readyState !== WalletReadyState.Installed &&
        w.readyState !== WalletReadyState.Loadable
    );
    return { detected: installed, more: others };
  }, [wallets]);

  const handleSelect = async (name: string) => {
    try {
      setPending(name);
      select(name as Parameters<typeof select>[0]);
      // Give the provider a tick to register the selection before connecting
      await new Promise((r) => setTimeout(r, 50));
      await connect();
      toast.success(`Connected with ${name}`);
      onOpenChange(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to connect";
      toast.error(msg);
    } finally {
      setPending(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "glass-strong border-foreground/10 sm:max-w-md p-0 overflow-hidden",
          "shadow-[0_30px_120px_-20px_hsl(0_0%_0%/0.35)]"
        )}
      >
        <DialogHeader className="px-6 pt-6 pb-2 relative">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <WalletIcon className="w-5 h-5 text-primary-foreground" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight">
                Connect a wallet
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Choose a Solana wallet to continue
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 space-y-4 relative">
          {detected.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80">
                Detected
              </p>
              {detected.map((w) => (
                <WalletRow
                  key={w.adapter.name}
                  name={w.adapter.name}
                  icon={w.adapter.icon}
                  badge="Detected"
                  pending={pending === w.adapter.name}
                  onClick={() => handleSelect(w.adapter.name)}
                />
              ))}
            </div>
          )}

          {more.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80">
                More options
              </p>
              {more.map((w) => (
                <WalletRow
                  key={w.adapter.name}
                  name={w.adapter.name}
                  icon={w.adapter.icon}
                  badge={w.readyState === WalletReadyState.NotDetected ? "Install" : undefined}
                  installUrl={w.adapter.url}
                  pending={pending === w.adapter.name}
                  onClick={() => {
                    if (w.readyState === WalletReadyState.NotDetected) {
                      window.open(w.adapter.url, "_blank", "noopener");
                      return;
                    }
                    handleSelect(w.adapter.name);
                  }}
                />
              ))}
            </div>
          )}

          {detected.length === 0 && more.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No Solana wallets found.
            </p>
          )}

          <p className="text-[11px] text-muted-foreground/70 text-center pt-2">
            By connecting, you agree to the Terms of Service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface WalletRowProps {
  name: string;
  icon?: string;
  badge?: string;
  installUrl?: string;
  pending?: boolean;
  onClick: () => void;
}

const WalletRow = ({ name, icon, badge, installUrl, pending, onClick }: WalletRowProps) => {
  const isInstall = badge === "Install";
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className={cn(
        "group w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3",
        "glass border border-foreground/10 hover:border-foreground/20",
        "transition-all duration-300",
        "hover:scale-[1.01] hover:shadow-[0_8px_24px_-8px_hsl(0_0%_0%/0.2)]",
        "disabled:opacity-60 disabled:cursor-not-allowed"
      )}
    >
      <span className="flex items-center gap-3 min-w-0">
        {icon ? (
          <img src={icon} alt="" className="w-8 h-8 rounded-lg" />
        ) : (
          <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <WalletIcon className="w-4 h-4 text-muted-foreground" />
          </span>
        )}
        <span className="font-medium text-sm text-foreground truncate">{name}</span>
      </span>
      <span className="flex items-center gap-2">
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin text-foreground" />
        ) : badge ? (
          <span
            className={cn(
              "text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border",
              isInstall
                ? "bg-muted text-muted-foreground border-border"
                : "bg-primary text-primary-foreground border-primary"
            )}
          >
            {isInstall && <Download className="inline w-3 h-3 mr-1 -mt-0.5" />}
            {badge}
          </span>
        ) : null}
      </span>
    </button>
  );
};
