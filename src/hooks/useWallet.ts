import { useCallback, useMemo } from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";

export type WalletStatus = "disconnected" | "connecting" | "connected";

function shortAddress(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

/**
 * Thin wrapper over @solana/wallet-adapter-react keeping the existing
 * UI API stable. `connect()` opens the wallet selection modal via the
 * provided `openModal` callback (handled by WalletButton).
 */
export function useWallet() {
  const { publicKey, connecting, connected, disconnect: adapterDisconnect, wallet } = useSolanaWallet();

  const address = useMemo(() => publicKey?.toBase58() ?? null, [publicKey]);

  const status: WalletStatus = connecting
    ? "connecting"
    : connected
    ? "connected"
    : "disconnected";

  const disconnect = useCallback(async () => {
    try {
      await adapterDisconnect();
    } catch {
      /* noop */
    }
  }, [adapterDisconnect]);

  return {
    address,
    short: address ? shortAddress(address) : "",
    status,
    isConnected: connected,
    walletName: wallet?.adapter.name ?? null,
    walletIcon: wallet?.adapter.icon ?? null,
    disconnect,
  };
}
