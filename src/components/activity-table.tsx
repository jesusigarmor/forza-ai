import type { Activity } from "@/lib/types";
import { sportIcon, sportColor } from "@/lib/sport-utils";

interface ActivityTableProps {
  activities: Activity[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">Recent Activities</h2>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
              <th className="px-5 py-3 font-medium">Activity</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Distance</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Pace</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="border-b border-[var(--color-border-subtle)] transition-colors last:border-0 hover:bg-[var(--color-surface-hover)]"
              >
                <td className="flex items-center gap-3 px-5 py-4">
                  <span className={sportColor(activity.sportType)}>
                    {sportIcon(activity.sportType)}
                  </span>
                  <span className="font-medium">{activity.name}</span>
                </td>
                <td className="px-5 py-4 text-[var(--color-text-muted)]">
                  {activity.date}
                </td>
                <td className="px-5 py-4">{activity.distance} km</td>
                <td className="px-5 py-4 text-[var(--color-text-secondary)]">
                  {activity.duration}
                </td>
                <td className="px-5 py-4 text-[var(--color-text-secondary)]">
                  {activity.pace}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
