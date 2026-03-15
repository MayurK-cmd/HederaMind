import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat";
import agentRouter from "./routes/agent";
import historyRouter from "./routes/history";
import registryRouter from "./routes/registry";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { getAgent } from "./agent/tools/index";
import { hasAgentState } from "./registration/agentState";
import { startListener } from "./messaging/listener";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({
  origin: [
    process.env.FRONTEND_URL ?? "http://localhost:5173",
   
  ],
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/chat",     chatRouter);
app.use("/api/agent",    agentRouter);
app.use("/api/history",  historyRouter);
app.use("/api/registry", registryRouter);

app.get("/health", (_req, res) =>
  res.json({ status: "ok", ts: new Date().toISOString() })
);

// Catch-all 404 — return JSON not HTML
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

// ── Boot ──────────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  logger.info(`HederaMind backend running on http://localhost:${PORT}`);
  logger.info("Routes: /api/chat  /api/agent  /api/history  /api/registry  /health");

  if (!hasAgentState()) {
    logger.warn("No agent state found. Run: npm run register");
  } else {
    await getAgent();
    await startListener();
  }
});