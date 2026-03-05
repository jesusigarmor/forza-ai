import { Plus } from "lucide-react";
import { MessageBubble } from "@/components/message-bubble";
import { ChatInput } from "@/components/chat-input";
import { TypingIndicator } from "@/components/typing-indicator";
import { mockChatMessages } from "@/lib/mock-data";

export default function ChatPage() {
  const lastMessage = mockChatMessages[mockChatMessages.length - 1];
  const isLastMessageStreaming = lastMessage?.role === "assistant";

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
        <h1 className="text-lg font-semibold">Chat with ForzaAI</h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--color-surface)]"
        >
          <Plus size={14} />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {mockChatMessages.map((message, idx) => {
            const isLast = idx === mockChatMessages.length - 1;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={isLast && isLastMessageStreaming}
              />
            );
          })}
          <TypingIndicator />
        </div>
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
