import { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AgentCard } from "../components/AgentCard";
import { ChatWindow } from "../components/ChatWindow";
import type { ChatWindowHandle } from "../components/ChatWindow";
import { WalletPanel } from "../components/WalletPanel";
import { HCSBroadcast } from "../components/HCSBroadcast";
import { useAgent } from "../hooks/useAgent";

export function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agent, loading } = useAgent();
  const chatRef = useRef<ChatWindowHandle>(null);

  useEffect(() => {
    const state = location.state as { initialMessage?: string } | null;
    if (state?.initialMessage && chatRef.current) {
      chatRef.current.sendMessage(state.initialMessage);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleAskAboutWallet = (accountId: string) => {
    chatRef.current?.sendMessage(
      `What is the balance and recent transaction history for my account ${accountId}?`
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-[#1a1a1e]">
      {/* Sidebar */}
      <aside className="w-80 shrink-0 border-r border-slate-100 flex flex-col bg-[#FBFBFC] p-6 gap-6 overflow-y-auto">
        {/* Brand */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 py-2 hover:opacity-80 transition-all text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
            H
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight leading-tight cursor-pointer">HederaMind</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">HOL Agent</p>
          </div>
        </button>

        <div className="space-y-6">
          {/* Component styling is inherited from their own files, but wrapped here */}
          <section>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Identity</p>
             <AgentCard agent={agent} loading={loading} />
          </section>

          <section>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Connection</p>
             <WalletPanel onAskAboutWallet={handleAskAboutWallet} />
          </section>

          <section>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">On-Chain Write</p>
             <HCSBroadcast />
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-auto pt-6 border-t border-slate-200/50 space-y-3 text-[12px] text-slate-500 font-medium">
          <a href="https://hol.org/registry" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-indigo-600">
            <span>HOL Registry</span>
            <span>→</span>
          </a>
          <a href="https://hashscan.io/testnet" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-indigo-600">
            <span>Hashscan Explorer</span>
            <span>→</span>
          </a>
        </div>
      </aside>

      {/* Chat main area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="border-b border-slate-100 px-8 py-4 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md">
          <div>
            <p className="font-bold text-sm text-slate-900 tracking-tight">Agent Terminal</p>
            <p className="text-[11px] text-slate-400 font-medium">
              Connected to Mirror Node • Gemini 2.5 Flash
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Testnet</span>
            </div>
            <button
              onClick={() => navigate("/docs")}
              className="text-xs font-bold text-slate-400 hover:text-black transition-colors cursor-pointer"
            >
              Docs
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {/* Subtle background texture for chat area */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
          <ChatWindow ref={chatRef} />
        </div>
      </main>
    </div>
  );
}