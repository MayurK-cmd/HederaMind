import { AgentCard } from "./components/AgentCard";
import { ChatWindow } from "./components/ChatWindow";
import { useAgent } from "./hooks/useAgent";

export default function App() {
  const { agent, loading } = useAgent();

  return (
    <div className="flex h-screen overflow-hidden bg-hedera-dark">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-hedera-border flex flex-col p-4 gap-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 py-1">
          <div className="w-8 h-8 rounded-lg bg-hedera-purple flex items-center justify-center text-sm font-bold">
            H
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">HederaMind</p>
            <p className="text-[10px] text-gray-500">HOL Registry Agent</p>
          </div>
        </div>

        {/* Agent on-chain identity */}
        <AgentCard agent={agent} loading={loading} />

        {/* Quick info */}
        <div className="mt-auto space-y-2 text-[11px] text-gray-600">
          <p>All data is pulled live from Hedera testnet via Mirror Node.</p>
          <a
            href="https://hol.org/registry"
            target="_blank"
            rel="noreferrer"
            className="block text-hedera-purple hover:underline"
          >
            View in HOL Registry →
          </a>
          <a
            href="https://hashscan.io/testnet"
            target="_blank"
            rel="noreferrer"
            className="block text-hedera-purple hover:underline"
          >
            Open Hashscan Explorer →
          </a>
        </div>
      </aside>

      {/* Chat main area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="border-b border-hedera-border px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <p className="font-medium text-sm">Chat with HederaMind</p>
            <p className="text-[11px] text-gray-500">
              Ask about accounts, tokens, transactions, or network stats
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Hedera testnet
          </div>
        </header>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}