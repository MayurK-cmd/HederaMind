import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch("https://hederamind-kr9m.onrender.com/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.status === "ok" ? "online" : "error"))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#1a1a1e] selection:bg-indigo-100 font-sans">
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <div className="h-2 w-2 bg-white rounded-sm" />
            </div>
            <span className="font-bold tracking-tight text-lg text-slate-900">HederaMind</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-500">
            <button onClick={() => navigate("/docs")} className="hover:text-black cursor-pointer">Documentation</button>
            <a href="https://github.com/MayurK-cmd/HederaMind" target="_blank" rel="noreferrer" className="hover:text-black">GitHub</a>
          </div>
        </div>
        <button onClick={() => navigate("/chat")} className="text-[13px] font-semibold bg-[#1a1a1e] text-white px-5 py-2.5 rounded-full hover:bg-black transition-all shadow-sm cursor-pointer">
          Launch App
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-12 gap-y-12 md:gap-12">
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-full w-fit mb-8 shadow-sm">
              <span className={`relative flex h-2 w-2`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === 'online' ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                {status === 'online' ? 'System Operational' : 'System Offline'} • 0.0.8064708
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-8">
              The interface <br /> 
              <span className="text-gray-400 italic font-serif font-light">for</span> Hedera.
            </h1>
            <p className="text-xl text-gray-500 max-w-md leading-relaxed mb-10">
              An on-chain AI agent translating complex network data into human conversation.
            </p>
            <button onClick={() => navigate("/chat")} className="w-fit flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 cursor-pointer">
              Start Exploring →
            </button>
          </div>

          <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-4">
            <div className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
               <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Sample Query</p>
               <h3 className="text-2xl font-medium text-gray-800 leading-snug">
                 "What are the top 5 trending tokens on Hedera today?"
               </h3>
               <button onClick={() => navigate("/chat")} className="mt-6 text-sm font-bold flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
                 Try this query <span>→</span>
               </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <a href="https://hashscan.io/testnet/account/0.0.8064708" target="_blank" rel="noreferrer" className="bg-[#1a1a1e] p-6 rounded-[32px] text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Hashscan</p>
                 <p className="text-2xl font-light leading-tight">View <br/>Agent</p>
               </a>
               <a href="https://hol.org/registry" target="_blank" rel="noreferrer" className="bg-indigo-100 p-6 rounded-[32px] text-indigo-900 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                 <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">HOL Registry</p>
                 <p className="text-xl font-bold leading-tight">Verified <br/>Status</p>
               </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[13px] text-gray-400 font-medium">Built for Apex Hackathon 2026</p>
          <div className="flex gap-8 text-[13px] font-bold text-gray-800">
             <a href="https://hashscan.io/testnet/account/0.0.8064708" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Hashscan</a>
             <a href="https://hol.org/registry" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Registry</a>
             <a href="https://github.com/MayurK-cmd/HederaMind" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}