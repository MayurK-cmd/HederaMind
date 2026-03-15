import type { AgentInfo } from "../api/client";
import { StatusIndicator } from "./StatusIndicator";

interface Props {
  agent: AgentInfo | null;
  loading: boolean;
}

export function AgentCard({ agent, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-hedera-card border border-hedera-border rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-hedera-border rounded w-3/4 mb-2" />
        <div className="h-3 bg-hedera-border rounded w-1/2" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="bg-hedera-card border border-red-800/40 rounded-2xl p-4">
        <p className="text-red-400 text-xs">
          Agent not registered. Run{" "}
          <code className="font-mono bg-red-900/30 px-1 rounded">
            npm run register
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-hedera-card border border-hedera-border rounded-2xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-hedera-purple/30 flex items-center justify-center text-sm">
            🤖
          </div>
          <div>
            <p className="font-semibold text-sm text-white">{agent.name}</p>
            <p className="text-[11px] text-gray-400 font-mono">{agent.agentId}</p>
          </div>
        </div>
        <StatusIndicator online={true} />
      </div>

      {/* Network badge */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800/40 font-mono">
          {agent.network}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/40 font-mono">
          HCS-10
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800/40 font-mono">
          {agent.model}
        </span>
      </div>

      {/* Topics */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-500">Inbound topic</span>
          <span className="font-mono text-gray-300">{agent.inboundTopicId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Outbound topic</span>
          <span className="font-mono text-gray-300">{agent.outboundTopicId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Registered</span>
          <span className="text-gray-300">
            {new Date(agent.registeredAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-1">
        {agent.capabilities.map((cap) => (
          <span
            key={cap}
            className="text-[10px] px-2 py-0.5 rounded-full bg-hedera-border/60 text-gray-400 font-mono"
          >
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}