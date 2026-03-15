import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { SYSTEM_PROMPT } from "../systemPrompt";
import { getAccountBalanceTool, getAccountInfoTool } from "./accountTools";
import { getTransactionHistoryTool, getTransactionByIdTool } from "./transactionTools";
import { getTokenInfoTool, getAccountTokensTool } from "./tokenTools";
import { getHbarPriceTool, getNetworkStatsTool } from "./networkTools";
import { logger } from "../../utils/logger";

const tools = [
  getAccountBalanceTool,
  getAccountInfoTool,
  getTransactionHistoryTool,
  getTransactionByIdTool,
  getTokenInfoTool,
  getAccountTokensTool,
  getHbarPriceTool,
  getNetworkStatsTool,
];

// Gemini requires system prompt passed via the agent's prompt option, not as a message
const llm = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});

// Session history — only user/assistant turns, NO system messages in history
interface Turn {
  role: "user" | "assistant";
  content: string;
}

const sessionHistories = new Map<string, Turn[]>();

let _agent: ReturnType<typeof createReactAgent> | null = null;

export async function getAgent() {
  if (_agent) return _agent;

  logger.info("Initialising LangChain agent with Gemini...");

  // Pass system prompt via `prompt` option — this keeps it always first
  // and outside the message history Gemini receives
  _agent = createReactAgent({
    llm,
    tools,
    // stateModifier injects the system prompt as the very first message
    // before any history — Gemini requires system first, always
    stateModifier: SYSTEM_PROMPT,
  });

  logger.info(
    `Agent ready — model: ${process.env.GEMINI_MODEL ?? "gemini-2.0-flash"}, tools: ${tools.length}`
  );

  return _agent;
}

export async function chat(
  message: string,
  sessionId: string
): Promise<{ reply: string; toolsUsed: string[] }> {
  const agent = await getAgent();
  const toolsUsed: string[] = [];

  if (!sessionHistories.has(sessionId)) {
    sessionHistories.set(sessionId, []);
  }
  const history = sessionHistories.get(sessionId)!;

  // Build messages from history — only HumanMessage / AIMessage, NO SystemMessage
  // The system prompt is injected by stateModifier, always first, never in history
  const messages = [
    ...history.map((t) =>
      t.role === "user"
        ? new HumanMessage(t.content)
        : new AIMessage(t.content)
    ),
    new HumanMessage(message),
  ];

  const result = await agent.invoke(
    { messages },
    {
      callbacks: [
        {
          handleToolStart(
            _tool: unknown,
            _input: string,
            _runId: string,
            _parentRunId?: string,
            _tags?: string[],
            _metadata?: Record<string, unknown>,
            name?: string
          ) {
            if (name) toolsUsed.push(name);
          },
        },
      ],
    }
  );

  const lastMessage = result.messages[result.messages.length - 1];
  const reply =
    typeof lastMessage.content === "string"
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);

  // Save only user + assistant turns — never system
  history.push({ role: "user", content: message });
  history.push({ role: "assistant", content: reply });

  // Keep last 20 turns (10 exchanges)
  if (history.length > 20) history.splice(0, history.length - 20);

  return { reply, toolsUsed };
}

export function clearSession(sessionId: string): void {
  sessionHistories.delete(sessionId);
  logger.info(`Session cleared: ${sessionId}`);
}