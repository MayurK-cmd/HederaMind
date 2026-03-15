import type { Message } from "../hooks/useChat";
import { ToolCallBadge } from "./ToolCallBadge";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  if (message.loading) {
    return (
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm">
          HM
        </div>
        <div className="bg-white border-2 border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <div className="flex gap-1.5 items-center h-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar - High Contrast Square-ish style */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm transition-transform hover:scale-105 ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-slate-900 text-white"
        }`}
      >
        {isUser ? "YOU" : "HM"}
      </div>

      {/* Bubble - Better Contrast & Spacing */}
      <div
        className={`max-w-[82%] shadow-sm px-4 py-3 transition-all ${
          isUser
            ? "bg-indigo-50 border-2 border-indigo-200 rounded-2xl rounded-tr-sm"
            : "bg-white border-2 border-slate-200 rounded-2xl rounded-tl-sm"
        }`}
      >
        <p className={`text-[14px] leading-relaxed whitespace-pre-wrap font-medium ${
          isUser ? "text-indigo-950" : "text-slate-800"
        }`}>
          {message.content}
        </p>

        {!isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100">
            <ToolCallBadge tools={message.toolsUsed} />
          </div>
        )}

        <div className={`flex items-center gap-1.5 mt-2 ${isUser ? "justify-end" : "justify-start"}`}>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {isUser && (
             <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
          )}
        </div>
      </div>
    </div>
  );
}