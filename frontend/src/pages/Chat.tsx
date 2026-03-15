import { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AgentCard } from "../components/AgentCard";
import { ChatWindow } from "../components/ChatWindow";
import type {ChatWindowHandle} from "../components/ChatWindow";
import { WalletPanel } from "../components/WalletPanel";
import { HCSBroadcast } from "../components/HCSBroadcast";
import { useAgent } from "../hooks/useAgent";

export function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agent, loading } = useAgent();
  const chatRef = useRef<ChatWindowHandle>(null);

  // Handle initial message passed from Landing page example queries
  useEffect(() => {
    const state = location.state as { initialMessage?: string } | null;
    if (state?.initialMessage && chatRef.current) {
      chatRef.current.sendMessage(state.initialMessage);
      // Clear the state so it doesn't re-fire on re-render
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleAskAboutWallet = (accountId: string) => {
    chatRef.current?.sendMessage(
      `What is the balance and recent transaction history for my account ${accountId}?`
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-hedera-dark">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-hedera-border flex flex-col p-4 gap-4 overflow-y-auto">

        {/* Logo — click to go home */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 py-1 hover:opacity-80 transition-opacity text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-hedera-purple flex items-center justify-center text-sm font-bold shrink-0">
            H
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">HederaMind</p>
            <p className="text-[10px] text-gray-500">HOL Registry Agent</p>
          </div>
        </button>

        {/* Agent on-chain identity */}
        <AgentCard agent={agent} loading={loading} />

        {/* MetaMask wallet (optional) */}
        <WalletPanel onAskAboutWallet={handleAskAboutWallet} />

        {/* HCS on-chain broadcast */}
        <HCSBroadcast />

        {/* Footer links */}
        <div className="mt-auto space-y-2 text-[11px] text-gray-600">
          <p>All data pulled live from Hedera testnet via Mirror Node.</p>
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
        <header className="border-b border-hedera-border px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <p className="font-medium text-sm">Chat with HederaMind</p>
            <p className="text-[11px] text-gray-500">
              Ask about accounts, tokens, transactions, or network stats
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Hedera testnet
            </div>
            <button
              onClick={() => navigate("/connect")}
              className="text-[11px] px-3 py-1.5 rounded-lg border border-hedera-border text-gray-500 hover:text-gray-300 hover:border-hedera-purple/40 transition-colors"
            >
              Wallet
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatWindow ref={chatRef} />
        </div>
      </main>
    </div>
  );
}