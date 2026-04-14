"use client";

import { useState, useRef, useEffect } from "react";
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

    // Only add the user message — assistant bubble is added on first chunk
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setWaitingForFirst(true);

    let firstChunk = true;

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

        if (firstChunk) {
          firstChunk = false;
          setWaitingForFirst(false);
          // Insert the assistant bubble for the first time with actual content
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: chunk,
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      }
    } catch {
      setWaitingForFirst(false);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsStreaming(false);
      setWaitingForFirst(false);
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden animate-page-enter">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl pt-6 pb-2">
          <h1 className="text-2xl font-semibold">ask.</h1>
        </div>
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
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
