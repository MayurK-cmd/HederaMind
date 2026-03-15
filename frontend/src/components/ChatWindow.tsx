import { useState, KeyboardEvent } from "react";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "../hooks/useChat";

const SUGGESTIONS = [
  "What is the HBAR price right now?",
  "Get balance for account 0.0.1234",
  "Show network stats",
  "What tokens does account 0.0.5678 hold?",
];

export function ChatWindow() {
  const { messages, send, clear, isLoading, bottomRef } = useChat();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput("");
    await send(msg);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-hedera-border">
        {messages.length === 1 && (
          <div className="mt-4 mb-6">
            <p className="text-xs text-gray-500 mb-3 text-center">Try asking</p>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="text-left text-xs px-3 py-2 rounded-xl border border-hedera-border bg-hedera-card hover:border-hedera-purple/50 hover:bg-hedera-purple/10 transition-colors text-gray-400 hover:text-gray-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-hedera-border px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about any Hedera account, token, or transaction..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-hedera-card border border-hedera-border rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-hedera-purple/60 disabled:opacity-50 transition-colors"
            style={{ minHeight: "42px", maxHeight: "120px" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-[42px] w-[42px] rounded-xl bg-hedera-purple hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0"
          >
            <svg
              className="w-4 h-4 text-white rotate-90"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2 21L23 12 2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-[10px] text-gray-600">
            Enter to send · Shift+Enter for new line
          </p>
          <button
            onClick={() => void clear()}
            className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
          >
            clear chat
          </button>
        </div>
      </div>
    </div>
  );
}