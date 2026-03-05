import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({
  message,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-xs font-bold text-[var(--color-accent)]">
            F
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-indigo-500/10 border border-indigo-500/20"
              : "bg-[var(--color-surface)] border border-[var(--color-border)]"
          }`}
        >
          <FormattedContent content={message.content} />
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-0.5 bg-[var(--color-text-primary)] animate-blink" />
          )}
        </div>
      </div>
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const key = `line-${String(idx)}`;

        if (line.startsWith("- ")) {
          return (
            <p key={key} className="pl-3">
              <span className="text-[var(--color-text-muted)]">•</span>{" "}
              <InlineBold text={line.slice(2)} />
            </p>
          );
        }

        if (line.trim() === "") {
          return <div key={key} className="h-2" />;
        }

        return (
          <p key={key}>
            <InlineBold text={line} />
          </p>
        );
      })}
    </div>
  );
}

function InlineBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, idx) => {
        const key = `part-${String(idx)}`;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={key} className="font-semibold text-[var(--color-text-primary)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={key}>{part}</span>;
      })}
    </>
  );
}
