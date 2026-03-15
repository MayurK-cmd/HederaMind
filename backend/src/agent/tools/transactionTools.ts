import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { mirrorNode } from "../../hedera/mirrorNode";

export const getTransactionHistoryTool = tool(
  async ({ accountId, limit }) => {
    try {
      const txs = await mirrorNode.getTransactions(accountId, limit ?? 5);
      if (!txs.length) return `No transactions found for ${accountId}.`;

      return txs
        .map((tx) => {
          const date = new Date(
            Number(tx.consensus_timestamp) * 1000
          ).toLocaleString();
          return `• [${date}] ${tx.name} — ${tx.result} (ID: ${tx.transaction_id})`;
        })
        .join("\n");
    } catch {
      return `Could not fetch transactions for ${accountId}.`;
    }
  },
  {
    name: "getTransactionHistory",
    description:
      "Get the recent transaction history for a Hedera account. Returns up to 10 transactions.",
    schema: z.object({
      accountId: z.string().describe("Hedera account ID, e.g. 0.0.1234"),
      limit: z
        .number()
        .min(1)
        .max(10)
        .optional()
        .describe("Number of transactions to return (default 5, max 10)"),
    }),
  }
);

export const getTransactionByIdTool = tool(
  async ({ transactionId }) => {
    try {
      const tx = await mirrorNode.getTransactionById(transactionId);
      const date = new Date(
        Number(tx.consensus_timestamp) * 1000
      ).toLocaleString();
      const transfers = tx.transfers
        .map(
          (t) =>
            `  ${t.account}: ${t.amount > 0 ? "+" : ""}${(t.amount / 1e8).toFixed(4)} HBAR`
        )
        .join("\n");

      return [
        `Transaction ID: ${tx.transaction_id}`,
        `Type: ${tx.name}`,
        `Result: ${tx.result}`,
        `Timestamp: ${date}`,
        `Transfers:\n${transfers}`,
      ].join("\n");
    } catch {
      return `Could not find transaction ${transactionId}.`;
    }
  },
  {
    name: "getTransactionById",
    description: "Get full details of a specific Hedera transaction by its ID.",
    schema: z.object({
      transactionId: z
        .string()
        .describe("Hedera transaction ID, e.g. 0.0.1234@1234567890.000000000"),
    }),
  }
);