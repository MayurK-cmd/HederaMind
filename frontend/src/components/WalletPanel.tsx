import { useWallet } from "../hooks/useWallet";

interface Props {
  onAskAboutWallet: (accountId: string) => void;
}

export function WalletPanel({ onAskAboutWallet }: Props) {
  const { wallet, loading, error, connect, disconnect, refresh } = useWallet();

  const short = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!wallet.connected) {
    return (
      <div className="bg-hedera-card border border-hedera-border rounded-2xl p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.315 4.95L13.05.664a2.25 2.25 0 00-2.1 0L2.685 4.95A2.25 2.25 0 001.5 6.93v10.14a2.25 2.25 0 001.185 1.98l8.265 4.287a2.25 2.25 0 002.1 0l8.265-4.287A2.25 2.25 0 0022.5 17.07V6.93a2.25 2.25 0 00-1.185-1.98z"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-white">Connect Wallet</p>
        </div>

        <p className="text-xs text-gray-500">
          Connect MetaMask to query your own Hedera account and submit on-chain messages.
        </p>

        {error && (
          <p className="text-xs text-red-400 bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={() => void connect()}
          disabled={loading}
          className="w-full py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect MetaMask"}
        </button>

        <p className="text-[10px] text-gray-600 text-center">
          Hedera testnet via Hashio RPC
        </p>
      </div>
    );
  }

  return (
    <div className="bg-hedera-card border border-hedera-border rounded-2xl p-4 space-y-3">
      {/* Connected header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.315 4.95L13.05.664a2.25 2.25 0 00-2.1 0L2.685 4.95A2.25 2.25 0 001.5 6.93v10.14a2.25 2.25 0 001.185 1.98l8.265 4.287a2.25 2.25 0 002.1 0l8.265-4.287A2.25 2.25 0 0022.5 17.07V6.93a2.25 2.25 0 00-1.185-1.98z"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-white">Wallet connected</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>

      {/* Wallet details */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-500">EVM address</span>
          <span className="font-mono text-gray-300">{short(wallet.evmAddress!)}</span>
        </div>
        {wallet.accountId && (
          <div className="flex justify-between">
            <span className="text-gray-500">Account ID</span>
            <span className="font-mono text-gray-300">{wallet.accountId}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Balance</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-gray-300">
              {wallet.hbarBalance !== null
                ? `${wallet.hbarBalance.toFixed(4)} ℏ`
                : "—"}
            </span>
            <button
              onClick={() => void refresh()}
              className="text-gray-600 hover:text-gray-400 transition-colors"
              title="Refresh balance"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        {wallet.accountId && (
          <button
            onClick={() => onAskAboutWallet(wallet.accountId!)}
            className="w-full py-1.5 rounded-xl bg-hedera-purple/20 hover:bg-hedera-purple/30 border border-hedera-purple/30 text-purple-300 text-xs font-medium transition-colors"
          >
            Ask about my account
          </button>
        )}

        {wallet.accountId && (
          <a
            href={`https://hashscan.io/testnet/account/${wallet.accountId}`}
            target="_blank"
            rel="noreferrer"
            className="block text-center text-[10px] text-hedera-purple hover:underline"
          >
            View on Hashscan →
          </a>
        )}

        <button
          onClick={() => void disconnect()}
          className="w-full py-1.5 rounded-xl border border-hedera-border text-gray-600 hover:text-gray-400 text-xs transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}