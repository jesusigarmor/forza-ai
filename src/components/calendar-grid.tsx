import type { TrainingWeek } from "@/lib/types";
import { sportBgColor } from "@/lib/sport-utils";

interface CalendarGridProps {
  weeks: TrainingWeek[];
}

const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarGrid({ weeks }: CalendarGridProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-[var(--color-text-muted)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week) => (
        <div key={week.weekNumber} className="grid grid-cols-7 gap-1">
          {week.days.map((day) => (
            <div
              key={day.date}
              className="flex min-h-[80px] flex-col rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-background)] p-2"
            >
              <span className="mb-1 text-xs text-[var(--color-text-muted)]">
                {day.dayOfMonth}
              </span>
              <span
                className={`mt-auto inline-block rounded-md px-1.5 py-1 text-[11px] font-medium leading-tight ${sportBgColor(day.sport)}`}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
