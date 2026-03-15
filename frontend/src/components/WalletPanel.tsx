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
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner">
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.315 4.95L13.05.664a2.25 2.25 0 00-2.1 0L2.685 4.95A2.25 2.25 0 001.5 6.93v10.14a2.25 2.25 0 001.185 1.98l8.265 4.287a2.25 2.25 0 002.1 0l8.265-4.287A2.25 2.25 0 0022.5 17.07V6.93a2.25 2.25 0 00-1.185-1.98z"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-900 tracking-tight">Connect Wallet</p>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
          Optional: Link MetaMask to query your own account and sign on-chain messages.
        </p>

        {error && (
          <div className="mb-4 text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={() => void connect()}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Establishing Link..." : "Connect MetaMask"}
        </button>

        <p className="mt-3 text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
          Hedera Testnet (296)
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-indigo-600 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      {/* Subtle indicator of active connection */}
      <div className="absolute top-0 right-0 p-3">
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>

      {/* Connected header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
          <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
             <path d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0H3"/>
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 leading-none">Wallet Active</p>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Mirror Node Linked</p>
        </div>
      </div>

      {/* Wallet details */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">EVM</span>
          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded">{short(wallet.evmAddress!)}</span>
        </div>
        
        {wallet.accountId && (
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Hedera ID</span>
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded">{wallet.accountId}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Balance</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">
              {wallet.hbarBalance !== null
                ? `${wallet.hbarBalance.toFixed(2)} ℏ`
                : "—"}
            </span>
            <button
              onClick={() => void refresh()}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-indigo-600"
              title="Refresh balance"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {wallet.accountId && (
          <button
            onClick={() => onAskAboutWallet(wallet.accountId!)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-100"
          >
            Analyze My Portfolio
          </button>
        )}

        {wallet.accountId && (
          <a
            href={`https://hashscan.io/testnet/account/${wallet.accountId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            Explorer View <span className="text-[14px]">↗</span>
          </a>
        )}

        <button
          onClick={() => void disconnect()}
          className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest mt-2"
        >
          Disconnect Session
        </button>
      </div>
    </div>
  );
}