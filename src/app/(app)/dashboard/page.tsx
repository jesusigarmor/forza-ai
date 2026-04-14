import { Mountain, Timer, Activity, Route, Footprints, Bike, Waves, Dumbbell } from "lucide-react";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/stat-card";
import { getSession } from "@/lib/auth";
import {
  getStravaConnectionByUserId,
  hasActivities,
  getActivityStats,
  getSportBreakdown,
} from "@/lib/db";
import { formatDuration } from "@/lib/strava";
import type { SportBreakdown } from "@/lib/db/activities";
import type { ReactElement } from "react";

// ── Sport grouping ────────────────────────────────────────────────────────────

const SPORT_GROUP_MAP: Record<string, GroupKey> = {
  Run: "Run", TrailRun: "Run", Walk: "Run", Hike: "Run",
  Ride: "Ride", VirtualRide: "Ride", MountainBikeRide: "Ride",
  Swim: "Swim",
  WeightTraining: "WeightTraining",
};

const GROUP_ORDER = ["Run", "Ride", "Swim", "WeightTraining"] as const;
type GroupKey = typeof GROUP_ORDER[number];

interface AggregatedBreakdown {
  sportType: GroupKey;
  count: number;
  totalDistanceKm: number;
  totalElevationM: number;
  totalMovingTime: number;
  avgWatts: number | null;
  avgCadence: number | null;
}

function groupBreakdown(rows: SportBreakdown[]): AggregatedBreakdown[] {
  const acc: Partial<Record<GroupKey, AggregatedBreakdown>> = {};

  for (const row of rows) {
    const key = SPORT_GROUP_MAP[row.sportType];
    if (!key) continue;

    if (!acc[key]) {
      acc[key] = { sportType: key, count: 0, totalDistanceKm: 0, totalElevationM: 0, totalMovingTime: 0, avgWatts: null, avgCadence: null };
    }
    const g = acc[key]!;
    g.count           += row.count;
    g.totalDistanceKm  = Math.round((g.totalDistanceKm + row.totalDistanceKm) * 100) / 100;
    g.totalElevationM += row.totalElevationM;
    g.totalMovingTime += row.totalMovingTime;
    if (row.avgWatts !== null)   g.avgWatts   = g.avgWatts   === null ? row.avgWatts   : Math.round((g.avgWatts   + row.avgWatts)   / 2);
    if (row.avgCadence !== null) g.avgCadence = g.avgCadence === null ? row.avgCadence : Math.round((g.avgCadence + row.avgCadence) / 2);
  }

  return GROUP_ORDER.map(k => acc[k]).filter(Boolean) as AggregatedBreakdown[];
}

const GROUP_META: Record<GroupKey, { label: string; icon: ReactElement; color: string }> = {
  Run:            { label: "Run",            icon: <Footprints size={18} />, color: "text-[var(--color-run)]"  },
  Ride:           { label: "Ride",           icon: <Bike size={18} />,       color: "text-[var(--color-bike)]" },
  Swim:           { label: "Swim",           icon: <Waves size={18} />,      color: "text-[var(--color-swim)]" },
  WeightTraining: { label: "Weights",        icon: <Dumbbell size={18} />,   color: "text-purple-400"          },
};

function getSportStats(b: AggregatedBreakdown): { label: string; value: string }[] {
  const dist = { label: "Distance", value: `${b.totalDistanceKm} km` };
  const time = { label: "Time",     value: formatDuration(b.totalMovingTime) };
  const elev = { label: "Elevation",value: `${b.totalElevationM} m` };

  if (b.sportType === "WeightTraining") {
    return [{ label: "Sessions", value: String(b.count) }, time, elev];
  }

  if (b.sportType === "Ride") {
    const power = b.avgWatts ? { label: "Avg Power", value: `${b.avgWatts} W` } : time;
    return [dist, power, elev];
  }

  if (b.sportType === "Swim") {
    const distM = b.totalDistanceKm * 1000;
    const secPer100 = distM > 0 ? Math.round(b.totalMovingTime / (distM / 100)) : 0;
    const pace100 = secPer100 > 0
      ? `${Math.floor(secPer100 / 60)}:${String(secPer100 % 60).padStart(2, "0")} /100m`
      : "–";
    return [dist, { label: "Avg Pace", value: pace100 }, time];
  }

  // Run
  const secPerKm = b.totalDistanceKm > 0 ? Math.round(b.totalMovingTime / b.totalDistanceKm) : 0;
  const pace = secPerKm > 0
    ? `${Math.floor(secPerKm / 60)}:${String(secPerKm % 60).padStart(2, "0")} /km`
    : "–";
  return [dist, { label: "Avg Pace", value: pace }, elev];
}

// ── Strava icon ───────────────────────────────────────────────────────────────

function StravaIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const connection = await getStravaConnectionByUserId(user.id);
  const { connected } = await searchParams;

  // ── State 1: No Strava connection ─────────────────────────────────────────
  if (!connection) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-14 pb-28">
        <h1 className="text-2xl font-semibold">Hey, {user.name.split(" ")[0]}</h1>
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
              <StravaIcon />
            </div>
            <h2 className="text-lg font-semibold">Connect Strava</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Link your Strava account to see your training metrics and chat with your AI coach.
            </p>
            <a
              href="/api/auth/strava"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[#0A0D0F] transition hover:bg-[var(--color-accent-hover)]"
            >
              Connect with Strava
            </a>
          </div>
        </div>
      </div>
    );
  }

  const synced = await hasActivities(user.id);

  // ── State 2: Connected but no activities synced yet ───────────────────────
  if (!synced) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-14 pb-28">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Hey, {user.name.split(" ")[0]}</h1>
          {connected === "true" && (
            <span className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Strava connected
            </span>
          )}
        </div>
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
              <StravaIcon />
            </div>
            <h2 className="text-lg font-semibold">Sync your training data</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Import your activities from Strava to see your metrics and unlock AI coaching.
            </p>
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Go to <a href="/connections" className="underline underline-offset-2">Connections</a> to sync your activities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── State 3: Activities in DB → show metrics ──────────────────────────────
  const [stats, rawBreakdown] = await Promise.all([
    getActivityStats(user.id),
    getSportBreakdown(user.id),
  ]);

  const breakdown = groupBreakdown(rawBreakdown);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 pb-28 animate-page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">analyze.</h1>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Distance" value={`${stats.totalDistanceKm.toLocaleString()} km`} icon={<Route size={18} />} />
        <StatCard label="Elevation"      value={`${stats.totalElevationM.toLocaleString()} m`}  icon={<Mountain size={18} />} />
        <StatCard label="Activities"     value={String(stats.totalActivities)}                  icon={<Activity size={18} />} />
        <StatCard label="Total Time"     value={`${stats.totalTimeHours} hrs`}                  icon={<Timer size={18} />} />
      </div>

      {/* Sport breakdown cards */}
      {breakdown.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {breakdown.map((b) => {
            const meta  = GROUP_META[b.sportType];
            const bStats = getSportStats(b);
            return (
              <div
                key={b.sportType}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className={meta.color}>{meta.icon}</span>
                  <span className="text-sm font-semibold">{meta.label}</span>
                  <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                    {b.count} activities
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {bStats.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                      <p className="text-sm font-medium tabular-nums">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
