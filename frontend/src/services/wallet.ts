const HEDERA_TESTNET = {
  chainId: "0x128",
  chainName: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpcUrls: ["https://testnet.hashio.io/api"],
  blockExplorerUrls: ["https://hashscan.io/testnet"],
};

export interface WalletState {
  connected: boolean;
  evmAddress: string | null;
  accountId: string | null;
  hbarBalance: number | null;
}

const MIRROR_BASE = "https://testnet.mirrornode.hedera.com/api/v1";

async function evmToAccountId(evmAddress: string): Promise<string | null> {
  try {
    const res = await fetch(`${MIRROR_BASE}/accounts/${evmAddress.toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json() as { account: string };
    return data.account ?? null;
  } catch {
    return null;
  }
}

async function fetchBalance(accountId: string): Promise<number> {
  try {
    const res = await fetch(`${MIRROR_BASE}/accounts/${accountId}`);
    if (!res.ok) return 0;
    const data = await res.json() as { balance: { balance: number } };
    return data.balance.balance / 1e8;
  } catch {
    return 0;
  }
}

async function addHederaNetwork(): Promise<void> {
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [HEDERA_TESTNET],
  });
}

async function switchToHedera(): Promise<void> {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: HEDERA_TESTNET.chainId }],
    });
  } catch (err: unknown) {
    if ((err as { code: number }).code === 4902) {
      await addHederaNetwork();
    } else {
      throw err;
    }
  }
}

export async function connectWallet(): Promise<WalletState> {
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask to connect your wallet.");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  }) as string[];

  if (!accounts.length) {
    throw new Error("No accounts returned from MetaMask.");
  }

  await switchToHedera();

  const evmAddress   = accounts[0];
  const accountId    = await evmToAccountId(evmAddress);
  const hbarBalance  = accountId ? await fetchBalance(accountId) : null;

  return { connected: true, evmAddress, accountId, hbarBalance };
}

export async function disconnectWallet(): Promise<WalletState> {
  return { connected: false, evmAddress: null, accountId: null, hbarBalance: null };
}

export async function refreshBalance(accountId: string): Promise<number> {
  return fetchBalance(accountId);
}

// Fix: use unknown[] then cast inside the callback
export function onAccountChange(cb: (address: string) => void): () => void {
  if (!window.ethereum) return () => {};

  const handler = (...args: unknown[]) => {
    const accounts = args[0] as string[];
    cb(accounts[0] ?? "");
  };

  window.ethereum.on("accountsChanged", handler);
  return () => window.ethereum.removeListener("accountsChanged", handler);
}

declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, cb: (...args: unknown[]) => void) => void;
      removeListener: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}