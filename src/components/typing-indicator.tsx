export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-xs font-bold text-[var(--color-accent)]">
          F
        </div>
        <div className="flex items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <span className="block h-2 w-2 rounded-full bg-[var(--color-text-muted)] animate-pulse-dot-1" />
          <span className="block h-2 w-2 rounded-full bg-[var(--color-text-muted)] animate-pulse-dot-2" />
          <span className="block h-2 w-2 rounded-full bg-[var(--color-text-muted)] animate-pulse-dot-3" />
        </div>
      </div>
    </div>
  );
}
