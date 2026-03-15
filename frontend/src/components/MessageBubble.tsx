import type { Message } from "../hooks/useChat";
import { ToolCallBadge } from "./ToolCallBadge";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  if (message.loading) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-hedera-purple/30 flex items-center justify-center text-xs shrink-0">
          HM
        </div>
        <div className="bg-hedera-card border border-hedera-border rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex gap-1 items-center h-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-medium ${
          isUser
            ? "bg-hedera-purple text-white"
            : "bg-hedera-purple/30 text-purple-300"
        }`}
      >
        {isUser ? "You" : "HM"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] ${
          isUser
            ? "bg-hedera-purple/20 border border-hedera-purple/40 rounded-2xl rounded-tr-sm"
            : "bg-hedera-card border border-hedera-border rounded-2xl rounded-tl-sm"
        } px-4 py-3`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-100">
          {message.content}
        </p>

        {!isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
          <ToolCallBadge tools={message.toolsUsed} />
        )}

        <p className="text-[10px] text-gray-500 mt-1.5">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}