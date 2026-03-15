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
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tools.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 text-[9px] px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border-2 border-indigo-100 font-mono font-black uppercase tracking-tighter shadow-sm"
        >
          <span className="text-indigo-400">⚡</span>
          {TOOL_LABELS[t] ?? t}
        </span>
      ))}
    </div>
  );
}