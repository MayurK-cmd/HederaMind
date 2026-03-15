import { Router, Request, Response } from "express";
import { logger } from "../utils/logger";

const router = Router();

const MIRROR_BASE = "https://testnet.mirrornode.hedera.com/api/v1";

// HOL testnet registry topic — agents submit registration messages here
const HOL_REGISTRY_TOPIC = "0.0.5222978";

interface RegistryMessage {
  consensus_timestamp: string;
  message: string;
  payer_account_id: string;
  sequence_number: number;
}

interface AgentProfile {
  accountId: string;
  name: string;
  description: string;
  capabilities: string[];
  model?: string;
  inboundTopicId?: string;
  outboundTopicId?: string;
  registeredAt: string;
}

function decodeMessage(raw: string): string {
  try {
    return Buffer.from(raw, "base64").toString("utf-8");
  } catch {
    return raw;
  }
}

async function fetchRegisteredAgents(): Promise<AgentProfile[]> {
  const url = `${MIRROR_BASE}/topics/${HOL_REGISTRY_TOPIC}/messages?limit=50&order=desc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mirror Node error: ${res.status}`);

  const data = (await res.json()) as { messages: RegistryMessage[] };
  const agents: AgentProfile[] = [];

  for (const msg of data.messages ?? []) {
    try {
      const decoded = decodeMessage(msg.message);
      const parsed = JSON.parse(decoded) as {
        p?: string;
        op?: string;
        account_id?: string;
        inbound_topic_id?: string;
        outbound_topic_id?: string;
        m?: string;
      };

      if (parsed.p !== "hcs-10" || parsed.op !== "register") continue;

      const meta = parsed.m ? (JSON.parse(parsed.m) as {
        name?: string;
        description?: string;
        capabilities?: string[];
        model?: string;
      }) : {};

      agents.push({
        accountId: parsed.account_id ?? msg.payer_account_id,
        name: meta.name ?? "Unknown Agent",
        description: meta.description ?? "",
        capabilities: meta.capabilities ?? [],
        model: meta.model,
        inboundTopicId: parsed.inbound_topic_id,
        outboundTopicId: parsed.outbound_topic_id,
        registeredAt: new Date(
          Number(msg.consensus_timestamp) * 1000
        ).toISOString(),
      });
    } catch {
      // skip malformed messages
    }
  }

  return agents;
}

// GET /api/registry/agents — list all registered agents
router.get("/agents", async (_req: Request, res: Response) => {
  try {
    const agents = await fetchRegisteredAgents();
    res.json({ agents, count: agents.length });
  } catch (err) {
    logger.error("Registry fetch error", err);
    res.status(500).json({ error: "Could not fetch registry" });
  }
});

// GET /api/registry/search?q=hedera — search by name or capability
router.get("/search", async (req: Request, res: Response) => {
  const q = ((req.query.q as string) ?? "").toLowerCase().trim();

  try {
    const agents = await fetchRegisteredAgents();

    const results = q
      ? agents.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.capabilities.some((c) => c.toLowerCase().includes(q))
        )
      : agents;

    res.json({ results, count: results.length, query: q });
  } catch (err) {
    logger.error("Registry search error", err);
    res.status(500).json({ error: "Could not search registry" });
  }
});

export default router;