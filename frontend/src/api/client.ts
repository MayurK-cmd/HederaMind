import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api" });

export interface ChatResponse {
  reply: string;
  toolsUsed: string[];
  sessionId: string;
  timestamp: string;
}

export interface AgentInfo {
  name: string;
  description: string;
  agentId: string;
  inboundTopicId: string;
  outboundTopicId: string;
  registeredAt: string;
  network: string;
  model: string;
  capabilities: string[];
  protocols: string[];
  registry: string;
}

export const chatApi = {
  send: async (message: string, sessionId: string): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>("/chat", {
      message,
      sessionId,
    });
    return data;
  },

  clearSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/chat/session/${sessionId}`);
  },
};

export const agentApi = {
  getInfo: async (): Promise<AgentInfo> => {
    const { data } = await api.get<AgentInfo>("/agent/info");
    return data;
  },
};