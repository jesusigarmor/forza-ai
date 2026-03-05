import { GoalForm } from "@/components/goal-form";
import { CalendarGrid } from "@/components/calendar-grid";
import { WeeklySummary } from "@/components/weekly-summary";
import { mockTrainingPlan } from "@/lib/mock-data";

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Training Plan</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Set your goal and let AI build your plan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <GoalForm />
        <div>
          <CalendarGrid weeks={mockTrainingPlan} />
          <WeeklySummary />
        </div>
      </div>
    </div>
  );
}
