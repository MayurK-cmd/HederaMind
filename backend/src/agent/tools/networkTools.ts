import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const getHbarPriceTool = tool(
  async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd&include_24hr_change=true"
      );
      const data = (await res.json()) as {
        "hedera-hashgraph": { usd: number; usd_24h_change: number };
      };
      const { usd, usd_24h_change } = data["hedera-hashgraph"];
      const change = usd_24h_change.toFixed(2);
      const direction = usd_24h_change >= 0 ? "▲" : "▼";
      // Return explicit formatted string — do not summarise this
      return `HBAR price: $${usd.toFixed(6)} USD  ${direction} ${change}% (24h change). Source: CoinGecko.`;
    } catch {
      return "ERROR: Could not fetch HBAR price from CoinGecko. The API may be temporarily unavailable.";
    }
  },
  {
    name: "getHbarPrice",
    description: "Get the current HBAR price in USD with 24h change. Always call this when asked about HBAR price.",
    schema: z.object({}),
  }
);

export const getNetworkStatsTool = tool(
  async () => {
    try {
      const res = await fetch(
        "https://testnet.mirrornode.hedera.com/api/v1/network/supply"
      );
      const data = (await res.json()) as {
        total_supply: string;
        released_supply: string;
        timestamp: string;
      };
      const total    = (Number(data.total_supply)    / 1e8).toLocaleString();
      const released = (Number(data.released_supply) / 1e8).toLocaleString();
      return `Hedera network stats:\n- Network: Testnet\n- Total HBAR supply: ${total} HBAR\n- Released supply: ${released} HBAR`;
    } catch {
      return "ERROR: Could not fetch network stats from Hedera Mirror Node.";
    }
  },
  {
    name: "getNetworkStats",
    description: "Get Hedera network statistics including total and released HBAR supply.",
    schema: z.object({}),
  }
);