"use client";

import { SendHorizonal } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && value.trim() && !disabled) {
      e.preventDefault();
      onSubmit(value.trim());
    }
  }

  function handleClick() {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  }

  return (
    <div className="shrink-0 px-4 pb-6 pt-2 md:px-6">
      <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0F1214]/90 pl-5 pr-2 py-2 shadow-2xl backdrop-blur-xl transition-colors focus-within:border-white/[0.15]">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about your training…"
          className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-[var(--color-text-muted)] disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || !value.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-[#0A0D0F] transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SendHorizonal size={16} />
        </button>
      </div>
    </div>
  );
}
