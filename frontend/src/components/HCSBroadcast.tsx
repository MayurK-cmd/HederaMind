import { useState } from "react";
import axios from "axios";

interface BroadcastResult {
  topicId: string;
  hashscanUrl: string;
  timestamp: string;
}

export function HCSBroadcast() {
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<BroadcastResult | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const submit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await axios.post<BroadcastResult>("/api/hedera/message", {
        content: content.trim(),
      });
      setResult(data);
      setContent("");
    } catch {
      setError("Failed to submit message to Hedera. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 leading-none tracking-tight">HCS Broadcast</p>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">On-Chain Anchor</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
        Record a permanent message to your agent's outbound HCS topic.
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message to anchor on-chain..."
        rows={2}
        disabled={loading}
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 placeholder-slate-300 resize-none focus:outline-none focus:border-emerald-500/50 focus:bg-white transition-all mb-4"
      />

      <button
        onClick={() => void submit()}
        disabled={!content.trim() || loading}
        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.98] disabled:opacity-20 cursor-pointer"
      >
        {loading ? "Anchoring to Hedera..." : "Submit to Consensus"}
      </button>

      {/* Success View */}
      {result && (
        <div className="mt-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <p className="text-[11px] font-black text-emerald-700 uppercase">Message Anchored</p>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-600/70 uppercase">Topic ID</span>
              <span className="font-mono text-[11px] font-bold text-emerald-900">{result.topicId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-600/70 uppercase">Time</span>
              <span className="text-[11px] font-bold text-emerald-900">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <a
            href={result.hashscanUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-center py-2 bg-white border border-emerald-200 rounded-lg text-[10px] font-black text-emerald-600 hover:bg-emerald-100 transition-colors uppercase tracking-tight shadow-sm"
          >
            Verify on Hashscan ↗
          </a>
        </div>
      )}

      {/* Error View */}
      {error && (
        <div className="mt-4 bg-red-50 border-2 border-red-100 rounded-xl px-4 py-3">
          <p className="text-[11px] font-bold text-red-600">
            ⚠️ {error}
          </p>
        </div>
      )}
    </div>
  );
}