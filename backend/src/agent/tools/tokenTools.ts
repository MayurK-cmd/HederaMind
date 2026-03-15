import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { mirrorNode } from "../../hedera/mirrorNode";

export const getTokenInfoTool = tool(
  async ({ tokenId }) => {
    try {
      const token = await mirrorNode.getTokenInfo(tokenId);
      return [
        `Token ID: ${token.token_id}`,
        `Name: ${token.name}`,
        `Symbol: ${token.symbol}`,
        `Type: ${token.type}`,
        `Decimals: ${token.decimals}`,
        `Total Supply: ${token.total_supply}`,
        `Treasury: ${token.treasury_account_id}`,
      ].join("\n");
    } catch {
      return `Could not fetch info for token ${tokenId}.`;
    }
  },
  {
    name: "getTokenInfo",
    description:
      "Get details about a Hedera token (HTS) including name, symbol, supply and treasury.",
    schema: z.object({
      tokenId: z.string().describe("Hedera token ID, e.g. 0.0.5678"),
    }),
  }
);

export const getAccountTokensTool = tool(
  async ({ accountId }) => {
    try {
      const tokens = await mirrorNode.getAccountTokens(accountId);
      if (!tokens.length)
        return `Account ${accountId} holds no HTS tokens.`;

      return (
        `Account ${accountId} holds ${tokens.length} token(s):\n` +
        tokens.map((t) => `• Token ${t.token_id}: balance ${t.balance}`).join("\n")
      );
    } catch {
      return `Could not fetch tokens for ${accountId}.`;
    }
  },
  {
    name: "getAccountTokens",
    description: "List all HTS tokens held by a Hedera account.",
    schema: z.object({
      accountId: z.string().describe("Hedera account ID, e.g. 0.0.1234"),
    }),
  }
);