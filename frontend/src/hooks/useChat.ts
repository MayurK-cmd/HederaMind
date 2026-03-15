import { useState, useCallback, useRef } from "react";
import { chatApi } from "../api/client";

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  toolsUsed?: string[];
  timestamp: Date;
  loading?: boolean;
}

const SESSION_ID = `session_${Date.now()}`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      content:
        "Hi! I'm HederaMind, your on-chain AI assistant. Ask me anything about Hedera — account balances, transactions, tokens, or network stats.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const send = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    const loadingMsg: Message = {
      id: `loading_${Date.now()}`,
      role: "agent",
      content: "",
      timestamp: new Date(),
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setIsLoading(true);
    scrollToBottom();

    try {
      const { reply, toolsUsed } = await chatApi.send(content, SESSION_ID);

      setMessages((prev) =>
        prev.map((m) =>
          m.loading
            ? {
                ...m,
                content: reply,
                toolsUsed,
                loading: false,
                timestamp: new Date(),
              }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.loading
            ? {
                ...m,
                content: "Something went wrong. Please try again.",
                loading: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [isLoading]);

  const clear = useCallback(async () => {
    await chatApi.clearSession(SESSION_ID);
    setMessages([
      {
        id: "welcome",
        role: "agent",
        content: "Chat cleared. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, send, clear, isLoading, bottomRef };
}