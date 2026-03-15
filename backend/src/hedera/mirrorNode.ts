import dotenv from "dotenv";
dotenv.config();

const MIRROR_BASE =
  process.env.HEDERA_NETWORK === "mainnet"
    ? "https://mainnet-public.mirrornode.hedera.com/api/v1"
    : "https://testnet.mirrornode.hedera.com/api/v1";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${MIRROR_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Mirror Node error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export interface AccountInfo {
  account: string;
  balance: { balance: number };
  created_timestamp: string;
  memo: string;
  transactions_count?: number;
}

export interface TokenInfo {
  token_id: string;
  name: string;
  symbol: string;
  decimals: string;
  total_supply: string;
  treasury_account_id: string;
  type: string;
}

export interface Transaction {
  transaction_id: string;
  name: string;
  consensus_timestamp: string;
  result: string;
  transfers: { account: string; amount: number }[];
}

export interface AccountToken {
  token_id: string;
  balance: number;
}

export const mirrorNode = {
  async getAccountInfo(accountId: string): Promise<AccountInfo> {
    return get<AccountInfo>(`/accounts/${accountId}`);
  },

  async getAccountBalance(accountId: string): Promise<number> {
    const info = await get<AccountInfo>(`/accounts/${accountId}`);
    // balance is in tinybars — convert to HBAR (1 HBAR = 100,000,000 tinybars)
    return info.balance.balance / 1e8;
  },

  async getTransactions(
    accountId: string,
    limit = 5
  ): Promise<Transaction[]> {
    const data = await get<{ transactions: Transaction[] }>(
      `/transactions?account.id=${accountId}&limit=${limit}&order=desc`
    );
    return data.transactions ?? [];
  },

  async getTransactionById(txId: string): Promise<Transaction> {
    const encoded = encodeURIComponent(txId);
    const data = await get<{ transactions: Transaction[] }>(
      `/transactions/${encoded}`
    );
    return data.transactions[0];
  },

  async getTokenInfo(tokenId: string): Promise<TokenInfo> {
    return get<TokenInfo>(`/tokens/${tokenId}`);
  },

  async getAccountTokens(accountId: string): Promise<AccountToken[]> {
    const data = await get<{ tokens: AccountToken[] }>(
      `/accounts/${accountId}/tokens?limit=10`
    );
    return data.tokens ?? [];
  },

  async getNetworkStats(): Promise<{ tps: number; totalTransactions: number }> {
    const data = await get<{ tps: number }[]>(`/network/supply`);
    return { tps: 0, totalTransactions: 0, ...data };
  },
};