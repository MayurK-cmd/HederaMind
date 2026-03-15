import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";

export function Connect() {
  const navigate = useNavigate();
  const { wallet, loading, error, connect, disconnect } = useWallet();

  const short = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <div className="min-h-screen bg-hedera-dark text-white flex flex-col">

      {/* Nav */}
      <nav className="border-b border-hedera-border px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-hedera-purple flex items-center justify-center font-bold text-sm">H</div>
          <span className="font-semibold text-sm">HederaMind</span>
        </button>
        <button
          onClick={() => navigate("/chat")}
          className="text-xs px-4 py-1.5 rounded-lg bg-hedera-purple hover:bg-purple-600 transition-colors font-medium"
        >
          Go to chat
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-6">

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.315 4.95L13.05.664a2.25 2.25 0 00-2.1 0L2.685 4.95A2.25 2.25 0 001.5 6.93v10.14a2.25 2.25 0 001.185 1.98l8.265 4.287a2.25 2.25 0 002.1 0l8.265-4.287A2.25 2.25 0 0022.5 17.07V6.93a2.25 2.25 0 00-1.185-1.98z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Connect your wallet</h2>
            <p className="text-sm text-gray-400">
              Optional — connect MetaMask to query your own Hedera account and broadcast on-chain messages.
            </p>
          </div>

          {/* Optional badge */}
          <div className="flex items-center gap-2 bg-hedera-card border border-hedera-border rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
            </svg>
            <p className="text-xs text-gray-400">
              Wallet connection is <span className="text-white font-medium">optional</span>. You can use HederaMind without connecting — just skip to chat.
            </p>
          </div>

          {!wallet.connected ? (
            <div className="space-y-4">
              {/* MetaMask connect */}
              <button
                onClick={() => void connect()}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.315 4.95L13.05.664a2.25 2.25 0 00-2.1 0L2.685 4.95A2.25 2.25 0 001.5 6.93v10.14a2.25 2.25 0 001.185 1.98l8.265 4.287a2.25 2.25 0 002.1 0l8.265-4.287A2.25 2.25 0 0022.5 17.07V6.93a2.25 2.25 0 00-1.185-1.98z"/>
                    </svg>
                    Connect MetaMask
                  </>
                )}
              </button>

              {error && (
                <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              {/* Network info */}
              <div className="bg-hedera-card border border-hedera-border rounded-xl px-4 py-3 space-y-2 text-[11px]">
                <p className="text-gray-400 font-medium">Network details</p>
                <div className="flex justify-between text-gray-500">
                  <span>Network</span>
                  <span className="text-gray-300">Hedera Testnet</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Chain ID</span>
                  <span className="font-mono text-gray-300">296 (0x128)</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>RPC</span>
                  <span className="font-mono text-gray-300 text-right">testnet.hashio.io/api</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Currency</span>
                  <span className="text-gray-300">HBAR</span>
                </div>
              </div>

              {/* Skip */}
              <button
                onClick={() => navigate("/chat")}
                className="w-full py-3 rounded-xl border border-hedera-border text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Skip — go to chat without wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected state */}
              <div className="bg-green-900/20 border border-green-800/40 rounded-xl px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-sm font-medium text-green-400">Wallet connected</p>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between text-gray-500">
                    <span>EVM address</span>
                    <span className="font-mono text-gray-300">{short(wallet.evmAddress!)}</span>
                  </div>
                  {wallet.accountId && (
                    <div className="flex justify-between text-gray-500">
                      <span>Hedera account</span>
                      <span className="font-mono text-gray-300">{wallet.accountId}</span>
                    </div>
                  )}
                  {wallet.hbarBalance !== null && (
                    <div className="flex justify-between text-gray-500">
                      <span>Balance</span>
                      <span className="text-gray-300">{wallet.hbarBalance.toFixed(4)} ℏ</span>
                    </div>
                  )}
                </div>
              </div>

              {wallet.accountId && (
                <a
                  href={`https://hashscan.io/testnet/account/${wallet.accountId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs text-hedera-purple hover:underline"
                >
                  View account on Hashscan →
                </a>
              )}

              <button
                onClick={() => navigate("/chat")}
                className="w-full py-3.5 rounded-xl bg-hedera-purple hover:bg-purple-600 transition-colors font-medium text-sm"
              >
                Go to chat
              </button>

              <button
                onClick={() => void disconnect()}
                className="w-full py-2.5 rounded-xl border border-hedera-border text-gray-500 hover:text-gray-300 text-xs transition-colors"
              >
                Disconnect wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}