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
      return `HBAR price: $${usd.toFixed(5)} USD  ${direction} ${change}% (24h)`;
    } catch {
      return "Could not fetch HBAR price right now. Try again in a moment.";
    }
  },
  {
    name: "getHbarPrice",
    description:
      "Get the current HBAR price in USD including 24-hour price change percentage.",
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

      const total = (Number(data.total_supply) / 1e8).toLocaleString();
      const released = (Number(data.released_supply) / 1e8).toLocaleString();

      return [
        `Network: Hedera Testnet`,
        `Total HBAR supply: ${total} HBAR`,
        `Released supply: ${released} HBAR`,
      ].join("\n");
    } catch {
      return "Could not fetch network stats right now.";
    }
  },
  {
    name: "getNetworkStats",
    description: "Get Hedera network statistics including total and released HBAR supply.",
    schema: z.object({}),
  }
);