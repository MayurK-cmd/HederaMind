import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";

export function Connect() {
  const navigate = useNavigate();
  const { wallet, loading, error, connect, disconnect } = useWallet();

  const short = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#1a1a1e] flex flex-col font-sans">
      {/* Nav */}
      <nav className="border-b border-slate-200/60 bg-white px-8 py-5 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-slate-200">H</div>
          <span className="font-bold tracking-tight text-slate-900">HederaMind</span>
        </button>
        <button
          onClick={() => navigate("/chat")}
          className="text-[13px] font-bold text-slate-500 hover:text-black transition-colors"
        >
          Skip to Chat →
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px] space-y-8">
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-[24px] bg-white border border-slate-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0H3"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Connect Wallet</h2>
            <p className="text-slate-500 mt-3 text-[15px] leading-relaxed">
              Link your MetaMask to query your personal account and broadcast HCS messages.
            </p>
          </div>

          {!wallet.connected ? (
            <div className="space-y-4">
              <button
                onClick={() => void connect()}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[15px] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Connect MetaMask"
                )}
              </button>

              {error && (
                <div className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Network Config Table */}
              <div className="bg-white border border-slate-200 rounded-[24px] p-6 space-y-4 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Requirements</p>
                <div className="space-y-3">
                  {[
                    ["Network", "Hedera Testnet"],
                    ["Chain ID", "296"],
                    ["Currency", "HBAR"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">{label}</span>
                      <span className="text-slate-900 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <p className="text-sm font-bold text-indigo-900">Account Linked</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-indigo-200/30 pb-2">
                    <span className="text-indigo-600/70 font-medium">EVM</span>
                    <span className="font-mono font-bold text-indigo-900">{short(wallet.evmAddress!)}</span>
                  </div>
                  {wallet.accountId && (
                    <div className="flex justify-between border-b border-indigo-200/30 pb-2">
                      <span className="text-indigo-600/70 font-medium">Hedera ID</span>
                      <span className="font-mono font-bold text-indigo-900">{wallet.accountId}</span>
                    </div>
                  )}
                  {wallet.hbarBalance !== null && (
                    <div className="flex justify-between">
                      <span className="text-indigo-600/70 font-medium">Balance</span>
                      <span className="font-bold text-indigo-900">{wallet.hbarBalance.toFixed(2)} ℏ</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate("/chat")}
                className="w-full py-4 rounded-2xl bg-[#1a1a1e] text-white hover:bg-black transition-all font-bold shadow-lg"
              >
                Go to chat
              </button>

              <button
                onClick={() => void disconnect()}
                className="w-full py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
          
          <p className="text-center text-[11px] text-slate-400 font-medium">
            Connection is used for identity verification only. <br/>
            No funds will be moved without your approval.
          </p>
        </div>
      </div>
    </div>
  );
}