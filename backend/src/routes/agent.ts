import { Router, Request, Response } from "express";
import { loadAgentState } from "../registration/agentState";

const router = Router();

// GET /api/agent/info
router.get("/info", (_req: Request, res: Response) => {
  const state = loadAgentState();

  if (!state) {
    res.status(404).json({
      error: "Agent not registered yet. Run: npm run register",
    });
    return;
  }

  res.json({
    name: "HederaMind",
    description: "AI agent for querying live Hedera network data",
    agentId: state.agentId,
    inboundTopicId: state.inboundTopicId,
    outboundTopicId: state.outboundTopicId,
    registeredAt: state.registeredAt,
    network: process.env.HEDERA_NETWORK ?? "testnet",
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    capabilities: [
      "hedera-query",
      "token-info",
      "transaction-history",
      "network-stats",
    ],
    protocols: ["HCS-10"],
    registry: "https://hol.org/registry",
  });
});

export default router;