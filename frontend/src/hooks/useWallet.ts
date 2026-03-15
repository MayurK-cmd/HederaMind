import { useState, useEffect, useCallback } from "react";
import {
  connectWallet,
  disconnectWallet,
  refreshBalance,
  onAccountChange,
 
} from "../services/wallet";
import type { WalletState} from "../services/wallet";

const INITIAL: WalletState = {
  connected: false,
  evmAddress: null,
  accountId: null,
  hbarBalance: null,
};

export function useWallet() {
  const [wallet, setWallet]   = useState<WalletState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await connectWallet();
      setWallet(state);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const state = await disconnectWallet();
    setWallet(state);
  }, []);

  const refresh = useCallback(async () => {
    if (!wallet.accountId) return;
    const hbarBalance = await refreshBalance(wallet.accountId);
    setWallet((prev) => ({ ...prev, hbarBalance }));
  }, [wallet.accountId]);

  // Listen for MetaMask account changes
  useEffect(() => {
    const cleanup = onAccountChange((address) => {
      if (!address) {
        setWallet(INITIAL);
      } else {
        // Re-connect with new address
        void connect();
      }
    });
    return cleanup;
  }, [connect]);

  return { wallet, loading, error, connect, disconnect, refresh };
}