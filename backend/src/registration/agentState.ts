import fs from "fs";
import path from "path";

const STATE_PATH = path.join(__dirname, "../../agent-state/agent.json");

export interface AgentState {
  agentId: string;
  inboundTopicId: string;
  outboundTopicId: string;
  registeredAt: string;
}

export function saveAgentState(state: AgentState): void {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

export function loadAgentState(): AgentState | null {
  if (!fs.existsSync(STATE_PATH)) return null;
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")) as AgentState;
}

export function hasAgentState(): boolean {
  return fs.existsSync(STATE_PATH);
}