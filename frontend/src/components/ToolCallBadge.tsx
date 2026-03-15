const TOOL_LABELS: Record<string, string> = {
  getAccountBalance: "balance lookup",
  getAccountInfo: "account info",
  getTransactionHistory: "tx history",
  getTransactionById: "tx lookup",
  getTokenInfo: "token info",
  getAccountTokens: "token holdings",
  getHbarPrice: "HBAR price",
  getNetworkStats: "network stats",
};

interface Props {
  tools: string[];
}

export function ToolCallBadge({ tools }: Props) {
  if (!tools.length) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tools.map((t) => (
        <span
          key={t}
          className="text-[10px] px-2 py-0.5 rounded-full bg-hedera-purple/20 text-purple-300 border border-hedera-purple/30 font-mono"
        >
          ⚡ {TOOL_LABELS[t] ?? t}
        </span>
      ))}
    </div>
  );
}