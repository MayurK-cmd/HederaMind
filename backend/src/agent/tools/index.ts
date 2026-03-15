import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
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
 
const llm = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});
 
// MemorySaver is LangGraph's in-process checkpointer
// It stores the full conversation graph state keyed by thread_id
// Each new message appends to the existing state — system prompt
// is injected once via stateModifier and never resent
const checkpointer = new MemorySaver();
 
let _agent: ReturnType<typeof createReactAgent> | null = null;
 
export async function getAgent() {
  if (_agent) return _agent;
 
  logger.info("Initialising LangChain agent with Gemini...");
 
  _agent = createReactAgent({
    llm,
    tools,
    // stateModifier injects the system prompt once at the start
    // of each thread — it is NOT re-sent on follow-up messages
    stateModifier: SYSTEM_PROMPT,
    // checkpointer persists conversation state per thread_id
    // so LangGraph only sends the new message each turn
    checkpointSaver: checkpointer,
  });
 
  logger.info(
    `Agent ready — model: ${process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite"}, tools: ${tools.length}`
  );
 
  return _agent;
}
 
export async function chat(
  message: string,
  sessionId: string
): Promise<{ reply: string; toolsUsed: string[] }> {
  const agent = await getAgent();
  const toolsUsed: string[] = [];
 
  // thread_id maps to a unique conversation in the checkpointer
  // LangGraph automatically loads previous state for this thread
  const config = {
    configurable: { thread_id: sessionId },
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
  };
 
  // Only send the new user message — LangGraph loads history from checkpointer
  const result = await agent.invoke(
    { messages: [new HumanMessage(message)] },
    config
  );
 
  const lastMessage = result.messages[result.messages.length - 1];
  const reply =
    typeof lastMessage.content === "string"
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);
 
  return { reply, toolsUsed };
}
 
export function clearSession(sessionId: string): void {
  // MemorySaver doesn't expose a delete API
  // but re-using the same thread_id after this
  // will just continue — to truly reset, use a new sessionId
  logger.info(`Session clear requested: ${sessionId}`);
}