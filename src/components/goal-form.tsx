"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { mockGoalEvents, mockSportStats } from "@/lib/mock-data";

export function GoalForm() {
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  function decrement() {
    setDaysPerWeek((prev) => Math.max(3, prev - 1));
  }

  function increment() {
    setDaysPerWeek((prev) => Math.min(7, prev + 1));
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      {/* Event type */}
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
          Goal Event
        </span>
        <select className="w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20">
          {mockGoalEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.label}
            </option>
          ))}
        </select>
      </label>

      {/* Target date */}
      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
          Target Date
        </span>
        <input
          type="date"
          defaultValue="2026-06-15"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20"
        />
      </label>

      {/* Days per week */}
      <div className="mt-5">
        <span className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
          Training Days per Week
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrement}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-lg font-semibold">
            {daysPerWeek}
          </span>
          <button
            type="button"
            onClick={increment}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Current stats */}
      <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-5">
        <span className="mb-1 block text-sm font-medium text-[var(--color-text-secondary)]">
          Your Current Stats
        </span>
        <span className="mb-4 block text-xs text-[var(--color-text-muted)]">
          Auto-detected from connected Strava data
        </span>
        <div className="grid grid-cols-3 gap-3">
          {mockSportStats.map((stat) => (
            <div
              key={stat.sport}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] p-3"
            >
              <span className="block text-xs font-semibold text-[var(--color-text-secondary)]">
                {stat.sport}
              </span>
              {stat.metrics.map((metric) => (
                <div key={metric.label} className="mt-1.5">
                  <span className="block text-sm font-bold">{metric.value}</span>
                  <span className="block text-[10px] text-[var(--color-text-muted)]">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        type="button"
        className="mt-6 w-full rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent-glow)]"
      >
        Generate Plan
      </button>
    </div>
  );
}
