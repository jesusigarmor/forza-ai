import {
  MapPin,
  Activity,
  CalendarDays,
  Flame,
  RefreshCw,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { ActivityTable } from "@/components/activity-table";
import { mockStats, mockActivities, mockUser } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">
          Good morning, {mockUser.firstName}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-all hover:bg-[var(--color-surface)] hover:shadow-lg hover:shadow-[var(--color-accent-glow)]"
          >
            <RefreshCw size={14} />
            Sync Now
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">
            Last synced {mockUser.lastSyncedAt}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Distance"
          value={`${mockStats.totalDistance.toLocaleString()} km`}
          icon={<MapPin size={18} />}
        />
        <StatCard
          label="Total Activities"
          value={String(mockStats.totalActivities)}
          icon={<Activity size={18} />}
        />
        <StatCard
          label="This Week"
          value={`${mockStats.weeklyDistance} km`}
          icon={<CalendarDays size={18} />}
        />
        <StatCard
          label="Current Streak"
          value={`${mockStats.currentStreak} days`}
          icon={<Flame size={18} />}
        />
      </div>

      <ActivityTable activities={mockActivities} />
    </div>
  );
}
