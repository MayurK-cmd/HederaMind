import { Router, Request, Response } from "express";
import { chat, clearSession } from "../agent/tools/index";
import { appendHistory, clearHistory } from "./history";
import { logger } from "../utils/logger";

const router = Router();

function param(req: Request, key: string): string {
  return String(req.params[key] ?? "");
}

// POST /api/chat
router.post("/", async (req: Request, res: Response) => {
  const { message, sessionId } = req.body as {
    message?: string;
    sessionId?: string;
  };

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const sid = sessionId ?? "default";

  try {
    logger.info(`Chat [${sid}]: ${message.slice(0, 80)}`);

    appendHistory(sid, {
      role: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    });

    const { reply, toolsUsed } = await chat(message.trim(), sid);

    appendHistory(sid, {
      role: "agent",
      content: reply,
      toolsUsed,
      timestamp: new Date().toISOString(),
    });

    res.json({
      reply,
      toolsUsed,
      sessionId: sid,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("Chat error", err);
    res.status(500).json({ error: "Agent error — please try again." });
  }
});

// DELETE /api/chat/session/:sessionId
router.delete("/session/:sessionId", (req: Request, res: Response) => {
  const sid = param(req, "sessionId");
  clearSession(sid);
  clearHistory(sid);
  res.json({ cleared: true });
});

export default router;