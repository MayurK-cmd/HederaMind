import dotenv from "dotenv";
dotenv.config();

import { createTopic, submitTopicMessage } from "../hedera/client";
import { saveAgentState } from "./agentState";
import { logger } from "../utils/logger";

// HOL testnet registry topic
const HOL_REGISTRY_TOPIC = "0.0.5222978";

export async function registerAgent(): Promise<void> {
  const operatorId = process.env.HEDERA_ACCOUNT_ID!;

  // 1. Create inbound topic — where others send messages TO the agent
  logger.info("Creating inbound topic...");
  const inboundTopicId = await createTopic("HederaMind inbound");

  // 2. Create outbound topic — where the agent broadcasts responses
  logger.info("Creating outbound topic...");
  const outboundTopicId = await createTopic("HederaMind outbound");

  // 3. Submit HCS-10 registration message to HOL registry
  logger.info("Registering in HOL registry...");
  const registrationPayload = JSON.stringify({
    p: "hcs-10",
    op: "register",
    account_id: operatorId,
    inbound_topic_id: inboundTopicId,
    outbound_topic_id: outboundTopicId,
    m: JSON.stringify({
      name: "HederaMind",
      description:
        "AI agent for querying live Hedera network data — balances, tokens, transactions and more.",
      capabilities: [
        "hedera-query",
        "token-info",
        "transaction-history",
        "network-stats",
      ],
      model: "gemini-2.0-flash",
      version: "1.0.0",
    }),
  });

  await submitTopicMessage(HOL_REGISTRY_TOPIC, registrationPayload);
  logger.info("Registration message submitted to HOL registry");

  // 4. Persist locally
  saveAgentState({
    agentId: operatorId,
    inboundTopicId,
    outboundTopicId,
    registeredAt: new Date().toISOString(),
  });

  logger.info("─────────────────────────────────────────────");
  logger.info("Registration complete. Copy these into your .env:");
  logger.info(`AGENT_ID=${operatorId}`);
  logger.info(`AGENT_INBOUND_TOPIC_ID=${inboundTopicId}`);
  logger.info(`AGENT_OUTBOUND_TOPIC_ID=${outboundTopicId}`);
  logger.info("─────────────────────────────────────────────");
}