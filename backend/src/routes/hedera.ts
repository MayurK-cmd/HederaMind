import { Router, Request, Response } from "express";
import { submitTopicMessage } from "../hedera/client";
import { loadAgentState } from "../registration/agentState";
import { logger } from "../utils/logger";

const router = Router();

// POST /api/hedera/message
// Submit a message to the agent's outbound HCS topic — proves on-chain write
router.post("/message", async (req: Request, res: Response) => {
  const { content } = req.body as { content?: string };

  if (!content || !content.trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  const state = loadAgentState();
  if (!state) {
    res.status(503).json({ error: "Agent not registered. Run: npm run register" });
    return;
  }

  try {
    const payload = JSON.stringify({
      p: "hcs-10",
      op: "message",
      operator_id: `${state.agentId}@${state.outboundTopicId}`,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    });

    await submitTopicMessage(state.outboundTopicId, payload);

    logger.info(`HCS message submitted to ${state.outboundTopicId}: "${content.slice(0, 60)}"`);

    res.json({
      success: true,
      topicId: state.outboundTopicId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      hashscanUrl: `https://hashscan.io/testnet/topic/${state.outboundTopicId}`,
    });
  } catch (err) {
    logger.error("HCS message submission failed", err);
    res.status(500).json({ error: "Failed to submit message to Hedera" });
  }
});

// GET /api/hedera/topics — returns agent topic IDs + hashscan links
router.get("/topics", (_req: Request, res: Response) => {
  const state = loadAgentState();
  if (!state) {
    res.status(404).json({ error: "Agent not registered" });
    return;
  }

  res.json({
    agentId: state.agentId,
    inboundTopicId: state.inboundTopicId,
    outboundTopicId: state.outboundTopicId,
    inboundHashscan: `https://hashscan.io/testnet/topic/${state.inboundTopicId}`,
    outboundHashscan: `https://hashscan.io/testnet/topic/${state.outboundTopicId}`,
    network: process.env.HEDERA_NETWORK ?? "testnet",
  });
});

export default router;