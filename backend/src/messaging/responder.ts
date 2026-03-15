import { submitTopicMessage } from "../hedera/client";
import { loadAgentState } from "../registration/agentState";
import { logger } from "../utils/logger";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPayload(
  agentId: string,
  outboundTopicId: string,
  content: string
): string {
  return JSON.stringify({
    p: "hcs-10",
    op: "message",
    operator_id: `${agentId}@${outboundTopicId}`,
    content,
    timestamp: new Date().toISOString(),
  });
}

async function submitWithRetry(
  topicId: string,
  payload: string,
  attempt = 1
): Promise<void> {
  try {
    await submitTopicMessage(topicId, payload);
  } catch (err) {
    if (attempt >= MAX_RETRIES) {
      logger.error(`Failed to submit to topic ${topicId} after ${MAX_RETRIES} attempts`, err);
      throw err;
    }
    const delay = RETRY_DELAY_MS * attempt;
    logger.warn(`Submit failed (attempt ${attempt}/${MAX_RETRIES}), retrying in ${delay}ms...`);
    await sleep(delay);
    await submitWithRetry(topicId, payload, attempt + 1);
  }
}

/**
 * Send a reply to a specific HCS connection topic.
 */
export async function respond(
  connectionTopicId: string,
  content: string
): Promise<void> {
  const state = loadAgentState();

  if (!state) {
    logger.warn("Cannot respond — agent state not found. Run: npm run register");
    return;
  }

  if (!connectionTopicId || !connectionTopicId.startsWith("0.0.")) {
    logger.warn(`Invalid connectionTopicId: "${connectionTopicId}" — skipping`);
    return;
  }

  const payload = buildPayload(state.agentId, state.outboundTopicId, content);

  logger.info(`Sending reply to topic ${connectionTopicId}: "${content.slice(0, 60)}..."`);
  await submitWithRetry(connectionTopicId, payload);
  logger.info(`Reply delivered to ${connectionTopicId}`);
}

/**
 * Broadcast on the agent's own outbound topic.
 */
export async function broadcast(content: string): Promise<void> {
  const state = loadAgentState();
  if (!state) {
    logger.warn("Cannot broadcast — agent state not found");
    return;
  }
  logger.info(`Broadcasting on ${state.outboundTopicId}`);
  await respond(state.outboundTopicId, content);
}