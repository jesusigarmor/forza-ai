import { db } from './client';
import { activities, activityBestEfforts } from './schema';
import { eq, desc, sql, and, isNull, or } from 'drizzle-orm';
import type { StravaRawActivity, StravaDetailedActivity, StravaBestEffort } from '@/lib/strava';

// ─── Upsert ───────────────────────────────────────────────────────────────────

export async function upsertActivities(userId: number, rawActivities: StravaRawActivity[]) {
  if (rawActivities.length === 0) return;

  for (const a of rawActivities) {
    const values = {
      user_id:            userId,
      strava_id:          a.id,
      name:               a.name,
      sport_type:         a.sport_type,
      start_date:         a.start_date_local,
      distance_km:        Math.round((a.distance / 1000) * 100) / 100,
      moving_time:        a.moving_time,
      elapsed_time:       a.elapsed_time,
      elevation_gain:     a.total_elevation_gain   ?? null,
      avg_heartrate:      a.average_heartrate      ?? null,
      max_heartrate:      a.max_heartrate          ?? null,
      avg_watts:          a.average_watts          ?? null,
      weighted_avg_watts: a.weighted_average_watts ?? null,
      kilojoules:         a.kilojoules             ?? null,
      avg_cadence:        a.average_cadence        ?? null,
      calories:           a.calories               ?? null,
      suffer_score:       a.suffer_score           ?? null,
      pr_count:           a.pr_count               ?? 0,
      max_speed:          a.max_speed              ?? null,
      average_speed:      a.average_speed          ?? null,
      elev_high:          a.elev_high              ?? null,
      elev_low:           a.elev_low               ?? null,
      achievement_count:  a.achievement_count      ?? 0,
      workout_type:       a.workout_type           ?? null,
      trainer:            a.trainer ? 1 : 0,
    };

    await db
      .insert(activities)
      .values(values)
      .onConflictDoUpdate({
        target: activities.strava_id,
        set: {
          name:               a.name,
          elevation_gain:     a.total_elevation_gain   ?? null,
          avg_heartrate:      a.average_heartrate      ?? null,
          avg_watts:          a.average_watts          ?? null,
          weighted_avg_watts: a.weighted_average_watts ?? null,
          suffer_score:       a.suffer_score           ?? null,
          calories:           a.calories               ?? null,
          pr_count:           a.pr_count               ?? 0,
          max_speed:          a.max_speed              ?? null,
          average_speed:      a.average_speed          ?? null,
          achievement_count:  a.achievement_count      ?? 0,
          workout_type:       a.workout_type           ?? null,
          trainer:            a.trainer ? 1 : 0,
          updated_at:         Math.floor(Date.now() / 1000),
        },
      });
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export type DbActivity = typeof activities.$inferSelect;

export async function getActivitiesByUserId(userId: number, limit = 20): Promise<DbActivity[]> {
  return db
    .select()
    .from(activities)
    .where(eq(activities.user_id, userId))
    .orderBy(desc(activities.start_date))
    .limit(limit);
}

export async function hasActivities(userId: number): Promise<boolean> {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(activities)
    .where(eq(activities.user_id, userId));
  return Number(result[0]?.count ?? 0) > 0;
}

// ─── Aggregate stats ─────────────────────────────────────────────────────────

export interface ActivityStats {
  totalDistanceKm: number;
  totalElevationM: number;
  totalActivities:  number;
  totalTimeHours:   number;
}

export async function getActivityStats(userId: number): Promise<ActivityStats> {
  const result = await db
    .select({
      totalDistanceKm: sql<number>`ROUND(COALESCE(SUM(${activities.distance_km}), 0))::integer`,
      totalElevationM: sql<number>`ROUND(COALESCE(SUM(COALESCE(${activities.elevation_gain}, 0)), 0))::integer`,
      totalActivities: sql<number>`COUNT(*)`,
      totalTimeHours:  sql<number>`ROUND(COALESCE(SUM(${activities.moving_time}), 0) / 3600.0)::integer`,
    })
    .from(activities)
    .where(eq(activities.user_id, userId));

  const row = result[0];
  return {
    totalDistanceKm: Number(row?.totalDistanceKm ?? 0),
    totalElevationM: Number(row?.totalElevationM ?? 0),
    totalActivities:  Number(row?.totalActivities  ?? 0),
    totalTimeHours:   Number(row?.totalTimeHours   ?? 0),
  };
}

// ─── Detail sync ─────────────────────────────────────────────────────────────

/** Returns strava_ids for activities that haven't had their detail endpoint fetched yet. */
export async function getActivitiesNeedingDetail(
  userId: number,
  limit = 30
): Promise<number[]> {
  const rows = await db
    .select({ strava_id: activities.strava_id })
    .from(activities)
    .where(
      and(
        eq(activities.user_id, userId),
        or(eq(activities.detail_fetched, 0), isNull(activities.detail_fetched))
      )
    )
    .orderBy(desc(activities.start_date))
    .limit(limit);
  return rows.map(r => r.strava_id);
}

export async function applyActivityDetail(
  stravaId: number,
  detail: StravaDetailedActivity
): Promise<void> {
  await db
    .update(activities)
    .set({
      average_temp:       detail.average_temp       ?? null,
      description:        detail.description        ?? null,
      perceived_exertion: detail.perceived_exertion ?? null,
      device_name:        detail.device_name        ?? null,
      detail_fetched:     1,
      updated_at:         Math.floor(Date.now() / 1000),
    })
    .where(eq(activities.strava_id, stravaId));
}

export async function upsertBestEfforts(
  userId: number,
  stravaActivityId: number,
  efforts: StravaBestEffort[]
): Promise<void> {
  if (efforts.length === 0) return;

  // Delete existing efforts for this activity then re-insert (simpler than per-name upsert)
  await db
    .delete(activityBestEfforts)
    .where(eq(activityBestEfforts.strava_activity_id, stravaActivityId));

  await db.insert(activityBestEfforts).values(
    efforts.map(e => ({
      user_id:            userId,
      strava_activity_id: stravaActivityId,
      name:               e.name,
      elapsed_time:       e.elapsed_time,
      moving_time:        e.moving_time,
      distance:           e.distance,
      pr_rank:            e.pr_rank ?? null,
      start_date:         e.start_date ?? null,
    }))
  );
}

export type DbBestEffort = typeof activityBestEfforts.$inferSelect;

export async function getBestEffortsByUserId(userId: number): Promise<DbBestEffort[]> {
  return db
    .select()
    .from(activityBestEfforts)
    .where(eq(activityBestEfforts.user_id, userId))
    .orderBy(activityBestEfforts.name, activityBestEfforts.elapsed_time);
}

export interface SportBreakdown {
  sportType:       string;
  count:           number;
  totalDistanceKm: number;
  totalElevationM: number;
  totalMovingTime: number;
  avgWatts:        number | null;
  avgCadence:      number | null;
}

export async function getSportBreakdown(userId: number): Promise<SportBreakdown[]> {
  const result = await db
    .select({
      sportType:       activities.sport_type,
      count:           sql<number>`COUNT(*)`,
      totalDistanceKm: sql<number>`ROUND(COALESCE(SUM(${activities.distance_km}), 0))::integer`,
      totalElevationM: sql<number>`ROUND(COALESCE(SUM(COALESCE(${activities.elevation_gain}, 0)), 0))::integer`,
      totalMovingTime: sql<number>`COALESCE(SUM(${activities.moving_time}), 0)`,
      avgWatts:        sql<number | null>`ROUND(AVG(NULLIF(${activities.avg_watts}, 0)))`,
      avgCadence:      sql<number | null>`ROUND(AVG(NULLIF(${activities.avg_cadence}, 0)))`,
    })
    .from(activities)
    .where(eq(activities.user_id, userId))
    .groupBy(activities.sport_type)
    .orderBy(sql`COUNT(*) DESC`);

  return result.map(r => ({
    sportType:       r.sportType,
    count:           Number(r.count),
    totalDistanceKm: Number(r.totalDistanceKm),
    totalElevationM: Number(r.totalElevationM),
    totalMovingTime: Number(r.totalMovingTime),
    avgWatts:        r.avgWatts != null ? Number(r.avgWatts) : null,
    avgCadence:      r.avgCadence != null ? Number(r.avgCadence) : null,
  }));
}
