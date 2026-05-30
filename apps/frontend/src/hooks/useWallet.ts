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
export function useWallet() {
  const { 
    publicKey, 
    connecting, 
    connected, 
    disconnect: adapterDisconnect, 
    wallet,
    signTransaction: adapterSignTransaction,
    sendTransaction: adapterSendTransaction
  } = useSolanaWallet();

  const [isMock, setIsMock] = useState(() => localStorage.getItem("aura_mock_wallet") === "true");

  useEffect(() => {
    const handleStorage = () => {
      setIsMock(localStorage.getItem("aura_mock_wallet") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const address = useMemo(() => {
    if (isMock) return MOCK_ADDRESS;
    return publicKey?.toBase58() ?? null;
  }, [publicKey, isMock]);

  // Auto-login to fetch JWT token
  useEffect(() => {
    if (address) {
      api.post<{token: string}>(API_ENDPOINTS.auth.login, {
        walletAddress: address,
        signature: 'mock_signature_for_now',
        message: 'login_request'
      }).then(res => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
        }
      }).catch(err => {
        console.error("Failed to authenticate wallet with backend", err);
      });
    } else {
      localStorage.removeItem('auth_token');
    }
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
