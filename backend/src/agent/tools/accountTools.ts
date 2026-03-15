import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { mirrorNode } from "../../hedera/mirrorNode";

export const getAccountBalanceTool = tool(
  async ({ accountId }) => {
    try {
      const hbar = await mirrorNode.getAccountBalance(accountId);
      return `Account ${accountId} has a balance of ${hbar.toFixed(4)} HBAR.`;
    } catch {
      return `Could not fetch balance for ${accountId}. Make sure the account ID is valid (e.g. 0.0.1234).`;
    }
  },
  {
    name: "getAccountBalance",
    description:
      "Get the current HBAR balance of a Hedera account. Input must be a valid Hedera account ID like 0.0.1234.",
    schema: z.object({
      accountId: z.string().describe("Hedera account ID, e.g. 0.0.1234"),
    }),
  }
);

export const getAccountInfoTool = tool(
  async ({ accountId }) => {
    try {
      const info = await mirrorNode.getAccountInfo(accountId);
      const hbar = info.balance.balance / 1e8;
      const created = new Date(
        Number(info.created_timestamp) * 1000
      ).toLocaleDateString();
      return [
        `Account: ${info.account}`,
        `Balance: ${hbar.toFixed(4)} HBAR`,
        `Created: ${created}`,
        `Memo: ${info.memo || "none"}`,
      ].join("\n");
    } catch {
      return `Could not fetch info for ${accountId}.`;
    }
  },
  {
    name: "getAccountInfo",
    description:
      "Get detailed information about a Hedera account including balance, creation date, and memo.",
    schema: z.object({
      accountId: z.string().describe("Hedera account ID, e.g. 0.0.1234"),
    }),
  }
);