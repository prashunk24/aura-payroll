import { useCallback, useEffect, useState } from "react";

/**
 * Solana wallet hook stub.
 * Detects Phantom (window.solana) when present; otherwise simulates a connection
 * so the UI is fully functional pre-integration. Replace internals with
 * @solana/wallet-adapter when wiring real chain calls.
 */

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString(): string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString(): string };
    };
  }
}

export type WalletStatus = "disconnected" | "connecting" | "connected";

const STORAGE_KEY = "solpay_wallet_address";

function shortAddress(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function mockAddress() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<WalletStatus>("disconnected");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAddress(saved);
      setStatus("connected");
    }
  }, []);

  const connect = useCallback(async () => {
    setStatus("connecting");
    try {
      let addr: string;
      if (typeof window !== "undefined" && window.solana?.isPhantom) {
        const resp = await window.solana.connect();
        addr = resp.publicKey.toString();
      } else {
        // Simulated handshake
        await new Promise((r) => setTimeout(r, 700));
        addr = mockAddress();
      }
      localStorage.setItem(STORAGE_KEY, addr);
      setAddress(addr);
      setStatus("connected");
      return addr;
    } catch (e) {
      setStatus("disconnected");
      throw e;
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await window.solana?.disconnect?.();
    } catch { /* noop */ }
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    setStatus("disconnected");
  }, []);

  return {
    address,
    short: address ? shortAddress(address) : "",
    status,
    isConnected: status === "connected",
    connect,
    disconnect,
  };
}
