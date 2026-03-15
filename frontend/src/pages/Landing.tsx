import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
      </svg>
    ),
    title: "Natural language queries",
    desc: "Ask anything about any Hedera account, token, or transaction in plain English.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
      </svg>
    ),
    title: "Live on-chain data",
    desc: "All responses are pulled in real time from the Hedera Mirror Node — no cached or fake data.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
      </svg>
    ),
    title: "HOL Registry agent",
    desc: "Registered on-chain via HCS-10. Discoverable and reachable by other agents in the HOL ecosystem.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0H3"/>
      </svg>
    ),
    title: "On-chain writes",
    desc: "Broadcast messages directly to Hedera HCS topics from the app — verifiable on Hashscan.",
  },
];

const EXAMPLE_QUERIES = [
  "What is the HBAR price right now?",
  "Show me the balance of account 0.0.1234",
  "What tokens does account 0.0.5678 hold?",
  "Show me the last 5 transactions for my account",
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hedera-dark text-white flex flex-col">

      {/* Nav */}
      <nav className="border-b border-hedera-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-hedera-purple flex items-center justify-center font-bold text-sm">H</div>
          <span className="font-semibold text-sm">HederaMind</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-hedera-purple/20 text-purple-300 border border-hedera-purple/30 font-mono">HOL Registry</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://hashscan.io/testnet/account/0.0.8064708"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Hashscan
          </a>
          <button
            onClick={() => navigate("/connect")}
            className="text-xs px-3 py-1.5 rounded-lg border border-hedera-border hover:border-hedera-purple/50 text-gray-400 hover:text-white transition-colors"
          >
            Connect wallet
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="text-xs px-4 py-1.5 rounded-lg bg-hedera-purple hover:bg-purple-600 transition-colors font-medium"
          >
            Launch app
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-3xl mx-auto w-full">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-hedera-border bg-hedera-card text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live on Hedera testnet · Agent ID 0.0.8064708
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-semibold leading-tight mb-5 text-white">
          Your AI agent on{" "}
          <span className="text-hedera-purple">Hedera</span>
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
          HederaMind is an on-chain AI agent registered in the HOL Registry.
          Ask it anything about Hedera in plain English — balances, tokens,
          transactions, and network stats, all answered with live data.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 mb-14">
          <button
            onClick={() => navigate("/chat")}
            className="px-6 py-3 rounded-xl bg-hedera-purple hover:bg-purple-600 transition-colors font-medium text-sm"
          >
            Start chatting
          </button>
          <button
            onClick={() => navigate("/connect")}
            className="px-6 py-3 rounded-xl border border-hedera-border hover:border-hedera-purple/50 text-gray-300 hover:text-white transition-colors text-sm"
          >
            Connect wallet
          </button>
        </div>

        {/* Example queries */}
        <div className="w-full max-w-lg">
          <p className="text-xs text-gray-600 mb-3">Example queries</p>
          <div className="grid grid-cols-1 gap-2">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => navigate("/chat", { state: { initialMessage: q } })}
                className="text-left text-xs px-4 py-2.5 rounded-xl border border-hedera-border bg-hedera-card hover:border-hedera-purple/40 hover:bg-hedera-purple/10 transition-colors text-gray-400 hover:text-gray-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-hedera-border px-6 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="space-y-2">
              <div className="text-hedera-purple">{f.icon}</div>
              <p className="text-sm font-medium text-white">{f.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-hedera-border px-6 py-4 flex items-center justify-between text-[11px] text-gray-600">
        <span>Built for Apex Hackathon 2025 — HOL Bounty</span>
        <div className="flex items-center gap-4">
          <a href="https://hol.org/registry" target="_blank" rel="noreferrer" className="hover:text-gray-400">HOL Registry</a>
          <a href="https://hashscan.io/testnet" target="_blank" rel="noreferrer" className="hover:text-gray-400">Hashscan</a>
        </div>
      </div>
    </div>
  );
}