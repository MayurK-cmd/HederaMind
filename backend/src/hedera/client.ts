import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  PrivateKey,
  AccountId,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
} from "@hashgraph/sdk";
import { logger } from "../utils/logger";

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function parsePrivateKey(raw: string): PrivateKey {
  const clean = raw.startsWith("0x") ? raw.slice(2) : raw;
  if (clean.startsWith("302") || clean.startsWith("308")) {
    return PrivateKey.fromStringDer(clean);
  }
  if (clean.length === 64) return PrivateKey.fromStringED25519(clean);
  if (clean.length === 66) return PrivateKey.fromStringECDSA(clean);
  return PrivateKey.fromStringDer(clean);
}

// ── Hedera SDK client singleton ───────────────────────────────────────────────
let _client: Client | null = null;
let _privateKey: PrivateKey | null = null;

export function getSDKClient(): Client {
  if (_client) return _client;

  const accountId  = requireEnv("HEDERA_ACCOUNT_ID");
  const privateKey = requireEnv("HEDERA_PRIVATE_KEY");
  const network    = process.env.HEDERA_NETWORK ?? "testnet";

  _privateKey = parsePrivateKey(privateKey);

  _client = network === "mainnet"
    ? Client.forMainnet()
    : Client.forTestnet();

  _client.setOperator(AccountId.fromString(accountId), _privateKey);

  logger.info(`Hedera SDK client ready — ${network} / ${accountId}`);
  return _client;
}

export function getPrivateKey(): PrivateKey {
  if (!_privateKey) getSDKClient();
  return _privateKey!;
}

// ── Topic helpers ─────────────────────────────────────────────────────────────

export async function createTopic(memo: string): Promise<string> {
  const client = getSDKClient();
  const key    = getPrivateKey();

  const tx = await new TopicCreateTransaction()
    .setTopicMemo(memo)
    .setSubmitKey(key.publicKey)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId!.toString();
  logger.info(`Topic created: ${topicId} (memo: "${memo}")`);
  return topicId;
}

export async function submitTopicMessage(
  topicId: string,
  message: string
): Promise<void> {
  const client = getSDKClient();

  await new TopicMessageSubmitTransaction()
    .setTopicId(TopicId.fromString(topicId))
    .setMessage(message)
    .execute(client);

  logger.info(`Message submitted to topic ${topicId}`);
}