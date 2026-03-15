import type { AgentInfo } from "../api/client";
import { StatusIndicator } from "./StatusIndicator";

interface Props {
  agent: AgentInfo | null;
  loading: boolean;
}

export function AgentCard({ agent, loading }: Props) {
  if (loading) return <div className="bg-slate-50 border-2 border-slate-100 h-32 animate-pulse rounded-2xl" />;

  if (!agent) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
        <p className="text-red-700 font-bold text-xs uppercase tracking-tight">Agent Not Found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm group hover:border-indigo-300 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h4 className="font-black text-slate-900 leading-tight">HederaMind</h4>
            <StatusIndicator online={true} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[10px] uppercase">HCS-10</span>
        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] uppercase">{agent.model}</span>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] font-bold">
        <div className="flex justify-between">
          <span className="text-slate-400 uppercase tracking-tighter">Inbound</span>
          <span className="text-slate-900 font-mono bg-slate-50 px-1.5 rounded">{agent.inboundTopicId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 uppercase tracking-tighter">Outbound</span>
          <span className="text-slate-900 font-mono bg-slate-50 px-1.5 rounded">{agent.outboundTopicId}</span>
        </div>
      </div>
    </div>
  );
}