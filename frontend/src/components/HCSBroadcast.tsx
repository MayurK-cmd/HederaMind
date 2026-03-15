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
    <div className="bg-hedera-card border border-hedera-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-white">Broadcast to Hedera</p>
      </div>

      <p className="text-xs text-gray-500">
        Submit a message to your agent's HCS outbound topic — permanently recorded on Hedera.
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter a message to broadcast on-chain..."
        rows={2}
        disabled={loading}
        className="w-full bg-hedera-dark border border-hedera-border rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-teal-500/50 disabled:opacity-50 transition-colors"
      />

      <button
        onClick={() => void submit()}
        disabled={!content.trim() || loading}
        className="w-full py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting to Hedera..." : "Submit on-chain"}
      </button>

      {/* Success */}
      {result && (
        <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3 space-y-1.5">
          <p className="text-xs text-green-400 font-medium">Message submitted</p>
          <div className="text-[10px] text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Topic</span>
              <span className="font-mono text-gray-300">{result.topicId}</span>
            </div>
            <div className="flex justify-between">
              <span>Time</span>
              <span className="text-gray-300">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
          <a
            href={result.hashscanUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-center text-[10px] text-teal-400 hover:underline pt-1"
          >
            View on Hashscan →
          </a>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}