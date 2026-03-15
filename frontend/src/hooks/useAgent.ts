import { useState, useEffect } from "react";
import { agentApi } from "../api/client";
import type { AgentInfo } from "../api/client";

export function useAgent() {
  const [agent, setAgent] = useState<AgentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    agentApi
      .getInfo()
      .then(setAgent)
      .catch(() => setError("Agent not registered yet"))
      .finally(() => setLoading(false));
  }, []);

  return { agent, loading, error };
}