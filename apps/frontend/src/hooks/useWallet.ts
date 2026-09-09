import { useCallback, useMemo, useState, useEffect } from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export type WalletStatus = "disconnected" | "connecting" | "connected";

function shortAddress(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

const MOCK_ADDRESS = "3gzpxbhT6UXT7cU8CLateSwEz1Wr23CsZNU8TnjJ75fy";

/**
 * Thin wrapper over @solana/wallet-adapter-react keeping the existing
 * UI API stable. Supports a "Mock Mode" for development.
 */
/** Addresses we've already tried to authenticate, shared across hook instances. */
const loginAttempts = new Set<string>();

const isBrowser = () => typeof window !== "undefined";

const readLocal = (key: string) => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeLocal = (key: string, value: string | null) => {
  if (!isBrowser()) return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) */
  }
};

export function useWallet() {
  const adapter = useSolanaWallet() ?? ({} as ReturnType<typeof useSolanaWallet>);
  const {
    publicKey = null,
    connecting = false,
    connected = false,
    disconnect: adapterDisconnect,
    wallet = null,
    signTransaction: adapterSignTransaction,
    sendTransaction: adapterSendTransaction,
  } = adapter;

  const [isMock, setIsMock] = useState(() => readLocal("aura_mock_wallet") === "true");

  useEffect(() => {
    if (!isBrowser()) return;
    const handleStorage = () => {
      setIsMock(readLocal("aura_mock_wallet") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const address = useMemo(() => {
    if (isMock) return MOCK_ADDRESS;
    try {
      return publicKey?.toBase58() ?? null;
    } catch {
      return null;
    }
  }, [publicKey, isMock]);

  // Auto-login to fetch JWT token (once per address, never blocks render)
  useEffect(() => {
    if (!isBrowser()) return;
    if (!address) {
      writeLocal("auth_token", null);
      return;
    }
    if (loginAttempts.has(address)) return;
    loginAttempts.add(address);

    let cancelled = false;
    api
      .post<{ token?: string }>(API_ENDPOINTS.auth.login, {
        walletAddress: address,
        signature: "mock_signature_for_now",
        message: "login_request",
      })
      .then((res) => {
        if (cancelled || !res?.token) return;
        writeLocal("auth_token", res.token);
      })
      .catch(() => {
        loginAttempts.delete(address);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  const status: WalletStatus = connecting
    ? "connecting"
    : (connected || isMock)
    ? "connected"
    : "disconnected";

  const disconnect = useCallback(async () => {
    if (isMock) {
      localStorage.removeItem("aura_mock_wallet");
      setIsMock(false);
      window.dispatchEvent(new Event("storage"));
      return;
    }
    try {
      await adapterDisconnect();
    } catch {
      /* noop */
    }
  }, [adapterDisconnect, isMock]);

  const connectMock = useCallback(() => {
    localStorage.setItem("aura_mock_wallet", "true");
    setIsMock(true);
    window.dispatchEvent(new Event("storage"));
  }, []);

  const signTransaction = useCallback(async (tx: any) => {
    if (isMock) {
      console.log("Mock signing transaction", tx);
      // In mock mode, we just return the transaction as is (already signed in logic or just bypass)
      // For real use, we'd need to mock the signature.
      return tx;
    }
    return adapterSignTransaction?.(tx);
  }, [isMock, adapterSignTransaction]);

  return {
    address,
    short: address ? `${shortAddress(address)}${isMock ? " (mock)" : ""}` : "",
    status,
    isConnected: connected || isMock,
    isMock,
    walletName: isMock ? "Dev Wallet" : (wallet?.adapter.name ?? null),
    walletIcon: isMock ? null : (wallet?.adapter.icon ?? null),
    disconnect,
    connectMock,
    signTransaction,
    sendTransaction: isMock 
      ? async () => "mock_signature_" + Math.random().toString(36).slice(2)
      : adapterSendTransaction,
  };
}
