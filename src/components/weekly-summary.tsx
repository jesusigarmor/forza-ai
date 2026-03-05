export function WeeklySummary() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
      <span className="text-sm font-medium text-[var(--color-text-secondary)]">
        Weekly Summary
      </span>
      <span className="text-xs text-[var(--color-text-muted)]">
        Total: <strong className="text-[var(--color-text-primary)]">8h 30min</strong>
      </span>
      <span className="text-xs text-[var(--color-run)]">
        Run: <strong>22 km</strong>
      </span>
      <span className="text-xs text-[var(--color-bike)]">
        Bike: <strong>75 km</strong>
      </span>
      <span className="text-xs text-[var(--color-swim)]">
        Swim: <strong>3 km</strong>
      </span>
    </div>
  );
}
