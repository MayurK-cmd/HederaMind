import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { mirrorNode } from "../../hedera/mirrorNode";

export const getAccountBalanceTool = tool(
  async ({ accountId }) => {
    try {
      const hbar = await mirrorNode.getAccountBalance(accountId);
      return `Account ${accountId} balance: ${hbar.toFixed(4)} HBAR (${(hbar * 1e8).toLocaleString()} tinybars). Data from Hedera testnet Mirror Node.`;
    } catch {
      return `ERROR: Could not fetch balance for account ${accountId}. The account may not exist on Hedera testnet. Valid format: 0.0.1234`;
    }
  },
  {
    name: "getAccountBalance",
    description: "Get the current HBAR balance of a Hedera account. Input: account ID like 0.0.1234",
    schema: z.object({
      accountId: z.string().describe("Hedera account ID e.g. 0.0.1234"),
    }),
  }
);

export const getAccountInfoTool = tool(
  async ({ accountId }) => {
    try {
      const info = await mirrorNode.getAccountInfo(accountId);
      const hbar    = info.balance.balance / 1e8;
      const created = new Date(Number(info.created_timestamp) * 1000).toLocaleDateString();
      return `Account ${info.account}:\n- Balance: ${hbar.toFixed(4)} HBAR\n- Created: ${created}\n- Memo: ${info.memo || "none"}`;
    } catch {
      return `ERROR: Could not fetch info for account ${accountId}. Check the account ID format (e.g. 0.0.1234) and ensure it exists on testnet.`;
    }
  },
  {
    name: "getAccountInfo",
    description: "Get detailed info about a Hedera account: balance, creation date, memo.",
    schema: z.object({
      accountId: z.string().describe("Hedera account ID e.g. 0.0.1234"),
    }),
  }
);