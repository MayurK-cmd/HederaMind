import React from 'react';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-16">
    <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-4">{children}</div>
  </section>
);

export default function Docs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Docs Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-5 w-5 bg-black rounded-sm rotate-45" />
            <span className="font-bold tracking-tight">HederaMind Docs</span>
          </div>
          <button onClick={() => navigate("/")} className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700">
            Back to App →
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-20">
          <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-3">Apex Hackathon 2026</p>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Project Documentation</h1>
          <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
            Hashgraph Online Bounty ($8,000 + 100K HOL Points). An autonomous AI agent anchored to the Hedera network via HCS-10.
          </p>
        </div>

        <Section title="What is HederaMind?">
          <p>
            HederaMind is an on-chain AI agent registered in the <strong>Hashgraph Online (HOL) Registry</strong> via the HCS-10 protocol. 
            It lets anyone query live Hedera blockchain data — account balances, token holdings, transaction history, and network stats — through a natural language chat interface.
          </p>
          <p className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500 italic">
            The agent is permanently anchored to Hedera testnet. Its identity, inbound and outbound communication channels are all HCS topics on-chain, visible and verifiable on Hashscan.
          </p>
        </Section>

        <Section title="On-chain Identity">
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Agent Account", "0.0.8064708"],
                  ["Inbound Topic", "0.0.8220666"],
                  ["Outbound Topic", "0.0.8220667"],
                  ["Network", "Hedera Testnet"],
                  ["Protocol", "HCS-10"],
                  ["Registry", "HOL Registry"],
                ].map(([prop, val]) => (
                  <tr key={prop} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{prop}</td>
                    <td className="px-6 py-4 font-mono text-indigo-600">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-4 text-xs font-bold">
            <a href="https://hashscan.io/testnet/account/0.0.8064708" className="text-slate-400 hover:text-black">View Account</a>
            <a href="https://hashscan.io/testnet/topic/0.0.8220666" className="text-slate-400 hover:text-black">Inbound Topic</a>
            <a href="https://hashscan.io/testnet/topic/0.0.8220667" className="text-slate-400 hover:text-black">Outbound Topic</a>
          </div>
        </Section>

        <Section title="Agent Capabilities">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold mb-2 text-slate-900">Natural Language Queries</h4>
              <p className="text-sm">Query HBAR prices, account balances, and token holdings using plain English.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold mb-2 text-slate-900">Wallet Integration</h4>
              <p className="text-sm">Connect MetaMask via Hashio RPC (Chain ID 296) to resolve EVM addresses.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold mb-2 text-slate-900">On-Chain Writes</h4>
              <p className="text-sm">Submit real transactions to HCS topics directly from the UI interface.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold mb-2 text-slate-900">Agent-to-Agent</h4>
              <p className="text-sm">HCS-10 enabled autonomous messaging between HOL registered agents.</p>
            </div>
          </div>
        </Section>

        <Section title="Tech Stack">
          <div className="space-y-3">
            {[
              { l: "AI Model", t: "Gemini 2.5 Flash (@langchain/google-genai)" },
              { l: "Framework", t: "LangChain + LangGraph" },
              { l: "Blockchain SDK", t: "@hashgraph/sdk v2.56" },
              { l: "Frontend", t: "React 18 + Vite + TailwindCSS" },
              { l: "Backend", t: "Node.js + TypeScript + Express" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between border-b border-slate-50 py-2 text-sm">
                <span className="font-medium text-slate-400">{item.l}</span>
                <span className="font-bold text-slate-800">{item.t}</span>
              </div>
            ))}
          </div>
        </Section>
        
        <footer className="mt-20 pt-10 border-t border-slate-100 text-center text-slate-400 text-xs">
          © 2026 HederaMind • MIT License • Built for Apex Hackathon 2026
        </footer>
      </div>
    </div>
  );
}