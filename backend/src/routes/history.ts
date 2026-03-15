import { Router, Request, Response } from "express";

const router = Router();

export interface HistoryEntry {
  role: "user" | "agent";
  content: string;
  toolsUsed?: string[];
  timestamp: string;
}

const store = new Map<string, HistoryEntry[]>();

export function appendHistory(sessionId: string, entry: HistoryEntry): void {
  if (!store.has(sessionId)) store.set(sessionId, []);
  store.get(sessionId)!.push(entry);
}

export function getHistory(sessionId: string): HistoryEntry[] {
  return store.get(sessionId) ?? [];
}

export function clearHistory(sessionId: string): void {
  store.delete(sessionId);
}

// Helper — Express params are always plain strings at runtime;
// the string | string[] union is a TypeScript over-approximation.
function param(req: Request, key: string): string {
  return String(req.params[key] ?? "");
}

// GET /api/history/:sessionId
router.get("/:sessionId", (req: Request, res: Response) => {
  const sessionId = param(req, "sessionId");
  const messages  = getHistory(sessionId);
  res.json({ sessionId, messages, count: messages.length });
});

// DELETE /api/history/:sessionId
router.delete("/:sessionId", (req: Request, res: Response) => {
  const sessionId = param(req, "sessionId");
  clearHistory(sessionId);
  res.json({ cleared: true, sessionId });
});

export default router;