"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { MessageBubble } from "@/components/message-bubble";
import { ChatInput } from "@/components/chat-input";
import { TypingIndicator } from "@/components/typing-indicator";
import type { ChatMessage } from "@/lib/types";

let msgCounter = 0;
function makeId() {
  return `msg-${++msgCounter}-${Date.now()}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [waitingForFirst, setWaitingForFirst] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waitingForFirst]);

  async function handleSubmit(text: string) {
    if (!text.trim() || isStreaming) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const assistantId = makeId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);
    setWaitingForFirst(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setWaitingForFirst(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      setWaitingForFirst(false);
    }
  }

  function handleNewChat() {
    if (isStreaming) return;
    setMessages([]);
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
        <h1 className="text-lg font-semibold">Chat with ForzaAI</h1>
        <button
          type="button"
          onClick={handleNewChat}
          disabled={isStreaming}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--color-surface)] disabled:opacity-40"
        >
          <Plus size={14} />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 && (
            <div className="mt-16 text-center text-sm text-[var(--color-text-muted)]">
              <p className="text-base font-medium text-[var(--color-text-secondary)]">Ask about your training</p>
              <p className="mt-1">Try: &ldquo;How many km did I run last week?&rdquo;</p>
            </div>
          )}

          {messages.map((message) => {
            const isLast = message.id === messages[messages.length - 1]?.id;
            const streaming = isLast && message.role === "assistant" && isStreaming && !waitingForFirst;
            return (
              <MessageBubble key={message.id} message={message} isStreaming={streaming} />
            );
          })}

          {waitingForFirst && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isStreaming}
      />
    </div>
  );
}
