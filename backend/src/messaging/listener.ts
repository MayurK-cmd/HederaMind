import dotenv from "dotenv";
dotenv.config();

import { loadAgentState } from "../registration/agentState";
import { logger } from "../utils/logger";
import { chat } from "../agent/tools/index";
import { respond } from "./responder";

const POLL_INTERVAL_MS = 5000;
const MIRROR_BASE =
  process.env.HEDERA_NETWORK === "mainnet"
    ? "https://mainnet-public.mirrornode.hedera.com/api/v1"
    : "https://testnet.mirrornode.hedera.com/api/v1";

let lastConsensusTimestamp = "0";
let isRunning = false;
let pollCount = 0;
let messagesHandled = 0;
let lastPollAt: Date | null = null;

interface HCSMessage {
  consensus_timestamp: string;
  message: string;
  payer_account_id: string;
  sequence_number: number;
}

interface ParsedHCS10Message {
  p: string;
  op: string;
  operator_id?: string;
  content?: string;
  connection_topic_id?: string;
}

function decodeMessage(raw: string): string {
  try {
    return Buffer.from(raw, "base64").toString("utf-8");
  } catch {
    return raw;
  }
}

async function fetchNewMessages(topicId: string): Promise<HCSMessage[]> {
  const url =
    `${MIRROR_BASE}/topics/${topicId}/messages` +
    `?limit=25&order=asc&timestamp=gt:${lastConsensusTimestamp}`;

  const res = await fetch(url);
  if (!res.ok) {
    logger.warn(`Mirror Node responded ${res.status} for topic ${topicId}`);
    return [];
  }

  const data = (await res.json()) as { messages?: HCSMessage[] };
  return data.messages ?? [];
}

async function handleMessage(msg: HCSMessage): Promise<void> {
  const decoded = decodeMessage(msg.message);

  let parsed: ParsedHCS10Message;
  try {
    parsed = JSON.parse(decoded) as ParsedHCS10Message;
  } catch {
    logger.debug(`Seq ${msg.sequence_number}: non-JSON payload, skipping`);
    return;
  }

  if (parsed.p !== "hcs-10") {
    logger.debug(`Seq ${msg.sequence_number}: not hcs-10 (p="${parsed.p}"), skipping`);
    return;
  }

  // ── op: connect ──────────────────────────────────────────────────────────────
  if (parsed.op === "connect") {
    logger.info(`HCS-10 connect from ${msg.payer_account_id}`);
    await respond(
      msg.payer_account_id,
      "Connected to HederaMind. Ask me anything about Hedera — " +
        "account balances, tokens, transactions, or network stats."
    );
    messagesHandled++;
    return;
  }

  // ── op: message ──────────────────────────────────────────────────────────────
  if (parsed.op === "message") {
    if (!parsed.content) {
      logger.warn(`Seq ${msg.sequence_number}: op=message but no content`);
      return;
    }

    logger.info(
      `HCS-10 message from ${msg.payer_account_id}: "${parsed.content.slice(0, 60)}"`
    );

    try {
      const { reply, toolsUsed } = await chat(
        parsed.content,
        `hcs_${msg.payer_account_id}`
      );
      logger.info(`Reply ready — tools: [${toolsUsed.join(", ") || "none"}]`);
      await respond(msg.payer_account_id, reply);
      messagesHandled++;
    } catch (err) {
      logger.error(`Failed to handle message from ${msg.payer_account_id}`, err);
      try {
        await respond(
          msg.payer_account_id,
          "Sorry, I encountered an error. Please try again."
        );
      } catch {
        // swallow so poll loop doesn't crash
      }
    }
    return;
  }

  logger.debug(`Seq ${msg.sequence_number}: unhandled op="${parsed.op}", skipping`);
}

async function poll(topicId: string): Promise<void> {
  lastPollAt = new Date();
  pollCount++;

  try {
    const messages = await fetchNewMessages(topicId);
    if (messages.length > 0) {
      logger.info(`Listener: ${messages.length} new message(s) on ${topicId}`);
    }
    for (const msg of messages) {
      await handleMessage(msg);
      lastConsensusTimestamp = msg.consensus_timestamp;
    }
  } catch (err) {
    logger.error("Listener poll error", err);
  }

  if (isRunning) {
    setTimeout(() => void poll(topicId), POLL_INTERVAL_MS);
  }
}

export async function startListener(): Promise<void> {
  const state = loadAgentState();
  if (!state) {
    logger.warn("No agent state — HCS-10 listener not started. Run: npm run register");
    return;
  }
  if (isRunning) {
    logger.warn("Listener already running");
    return;
  }
  isRunning = true;
  logger.info(`HCS-10 listener → polling ${state.inboundTopicId} every ${POLL_INTERVAL_MS}ms`);
  void poll(state.inboundTopicId);
}

export function stopListener(): void {
  isRunning = false;
  logger.info(`HCS-10 listener stopped (${messagesHandled} messages, ${pollCount} polls)`);
}

export function getListenerStatus() {
  return {
    running: isRunning,
    pollCount,
    messagesHandled,
    lastPollAt: lastPollAt?.toISOString() ?? null,
    lastConsensusTimestamp,
  };
}