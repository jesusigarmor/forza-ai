import { MapPin, Activity, CalendarDays, Flame } from "lucide-react";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/stat-card";
import { ActivityTable } from "@/components/activity-table";
import { getSession } from "@/lib/auth";
import { getStravaConnectionByUserId } from "@/lib/db";
import { getAthleteActivities, mapStravaActivity } from "@/lib/strava";
import type { DashboardStats } from "@/lib/types";

function computeStats(activities: ReturnType<typeof mapStravaActivity>[]): DashboardStats {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  let weeklyDistance = 0;
  let streak = 0;
  const activityDays = new Set<string>();

  for (const a of activities) {
    activityDays.add(a.date);
    const date = new Date(a.date);
    if (date >= startOfWeek) weeklyDistance += a.distance;
  }

  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);
  while (
    activityDays.has(
      checkDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    )
  ) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return {
    totalDistance: Math.round(activities.reduce((s, a) => s + a.distance, 0)),
    totalActivities: activities.length,
    weeklyDistance: Math.round(weeklyDistance * 10) / 10,
    currentStreak: streak,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const connection = await getStravaConnectionByUserId(user.id);
  const { connected } = await searchParams;

  // No Strava connection — show connect card
  if (!connection) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Good to see you, {user.name.split(" ")[0]}</h1>
        <div className="mt-12 flex flex-col items-center gap-6 text-center">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 max-w-md w-full">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-accent)">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Connect Strava</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Link your Strava account to see your training analytics and chat with your AI coach.
            </p>
            <a
              href="/api/auth/strava"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Connect with Strava
            </a>
          </div>
        </div>
      </div>
    );
  }

  const rawActivities = await getAthleteActivities(connection.access_token, { per_page: 20 });
  const activities = rawActivities.map(mapStravaActivity);
  const stats = computeStats(activities);

  const lastSynced = new Date(connection.updated_at * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">
          Good morning, {user.name.split(" ")[0]}
        </h1>
        <div className="flex items-center gap-3">
          {connected === "true" && (
            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              Strava connected
            </span>
          )}
          <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            Last synced {lastSynced}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Distance" value={`${stats.totalDistance.toLocaleString()} km`} icon={<MapPin size={18} />} />
        <StatCard label="Total Activities" value={String(stats.totalActivities)} icon={<Activity size={18} />} />
        <StatCard label="This Week" value={`${stats.weeklyDistance} km`} icon={<CalendarDays size={18} />} />
        <StatCard label="Current Streak" value={`${stats.currentStreak} days`} icon={<Flame size={18} />} />
      </div>

      <ActivityTable activities={activities} />
    </div>
  );
}
