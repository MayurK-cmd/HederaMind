import { useState, forwardRef, useImperativeHandle } from "react";
import type { KeyboardEvent } from "react";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "../hooks/useChat";

const SUGGESTIONS = [
  "What is the HBAR price right now?",
  "Show me Hedera network stats",
  "Get balance for account 0.0.8064708",
  "What tokens does account 0.0.8064708 hold?",
];

export interface ChatWindowHandle {
  sendMessage: (msg: string) => void;
}

export const ChatWindow = forwardRef<ChatWindowHandle>((_, ref) => {
  const { messages, send, clear, isLoading, bottomRef } = useChat();
  const [input, setInput] = useState("");

  useImperativeHandle(ref, () => ({
    sendMessage: (msg: string) => {
      void send(msg);
    },
  }));

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
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.length <= 1 && (
          <div className="max-w-2xl mx-auto mt-12 mb-12">
             <div className="text-center mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-indigo-100">
                    <span className="text-xl">✨</span>
                </div>
                <h2 className="text-slate-900 font-black text-lg uppercase tracking-tight">How can I help with Hedera?</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Select a quick action or type below</p>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="text-left text-xs px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-600 hover:shadow-md transition-all group cursor-pointer"
                >
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600">{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto w-full">
            {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
            ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-8 border-t-2 border-slate-50">
        <div className="max-w-3xl mx-auto">
            <div className="relative group bg-white border-2 border-slate-900 rounded-[24px] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus-within:shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] focus-within:border-indigo-600 transition-all">
                <div className="flex items-end gap-2 p-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Ask about accounts, tokens, or transactions..."
                        rows={1}
                        disabled={isLoading}
                        className="flex-1 bg-transparent px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-300 resize-none focus:outline-none disabled:opacity-50"
                        style={{ minHeight: "48px", maxHeight: "150px" }}
                        onInput={(e) => {
                            const t = e.currentTarget;
                            t.style.height = "auto";
                            t.style.height = `${Math.min(t.scrollHeight, 150)}px`;
                        }}
                    />
                    <button
                        onClick={() => void handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="h-[48px] px-6 rounded-[18px] bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? "Thinking..." : "Send"}
                        {!isLoading && (
                            <svg className="w-3 h-3 rotate" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2 21L23 12 2 3v7l15 2-15 2v7z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 px-2">
                <div className="flex gap-4">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Enter to send</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Shift+Enter for newline</p>
                </div>
                <button
                    onClick={() => void clear()}
                    className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer"
                >
                    Reset Chat
                </button>
            </div>
        </div>
      </div>
    </div>
  );
});

ChatWindow.displayName = "ChatWindow";