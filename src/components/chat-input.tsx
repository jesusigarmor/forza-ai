"use client";

import { SendHorizonal } from "lucide-react";

export function ChatInput() {
  return (
    <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-background)] px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="flex flex-1 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 focus-within:border-[var(--color-accent)]/50 focus-within:ring-1 focus-within:ring-[var(--color-accent)]/20">
          <input
            type="text"
            placeholder="Ask about your training..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent-glow)]"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}
