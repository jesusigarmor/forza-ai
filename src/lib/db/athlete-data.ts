import { db } from './client';
import { athleteStats, athleteZones } from './schema';
import { eq } from 'drizzle-orm';
import type { StravaAthleteStats, StravaAthleteZones } from '@/lib/strava';

// ─── Athlete stats ────────────────────────────────────────────────────────────

export type DbAthleteStats = typeof athleteStats.$inferSelect;

export async function upsertAthleteStats(
  userId: number,
  s: StravaAthleteStats
): Promise<void> {
  const values = {
    user_id:                 userId,
    ytd_run_distance:        s.ytd_run_totals.distance,
    ytd_run_count:           s.ytd_run_totals.count,
    ytd_run_time:            s.ytd_run_totals.moving_time,
    ytd_run_elevation:       s.ytd_run_totals.elevation_gain,
    ytd_ride_distance:       s.ytd_ride_totals.distance,
    ytd_ride_count:          s.ytd_ride_totals.count,
    ytd_ride_time:           s.ytd_ride_totals.moving_time,
    ytd_ride_elevation:      s.ytd_ride_totals.elevation_gain,
    ytd_swim_distance:       s.ytd_swim_totals.distance,
    ytd_swim_count:          s.ytd_swim_totals.count,
    ytd_swim_time:           s.ytd_swim_totals.moving_time,
    all_run_distance:        s.all_run_totals.distance,
    all_run_count:           s.all_run_totals.count,
    all_run_time:            s.all_run_totals.moving_time,
    all_run_elevation:       s.all_run_totals.elevation_gain,
    all_ride_distance:       s.all_ride_totals.distance,
    all_ride_count:          s.all_ride_totals.count,
    all_ride_time:           s.all_ride_totals.moving_time,
    all_ride_elevation:      s.all_ride_totals.elevation_gain,
    all_swim_distance:       s.all_swim_totals.distance,
    all_swim_count:          s.all_swim_totals.count,
    all_swim_time:           s.all_swim_totals.moving_time,
    biggest_ride_distance:   s.biggest_ride_distance,
    biggest_climb_elevation: s.biggest_climb_elevation_gain,
    updated_at:              Math.floor(Date.now() / 1000),
  };

  await db
    .insert(athleteStats)
    .values(values)
    .onConflictDoUpdate({ target: athleteStats.user_id, set: values });
}

export async function getAthleteStats(userId: number): Promise<DbAthleteStats | null> {
  const rows = await db
    .select()
    .from(athleteStats)
    .where(eq(athleteStats.user_id, userId))
    .limit(1);
  return rows[0] ?? null;
}

// ─── Athlete zones ────────────────────────────────────────────────────────────

export type DbAthleteZones = typeof athleteZones.$inferSelect;

export async function upsertAthleteZones(
  userId: number,
  z: StravaAthleteZones
): Promise<void> {
  const values = {
    user_id:     userId,
    hr_zones:    z.heart_rate ? JSON.stringify(z.heart_rate.zones) : null,
    power_zones: z.power      ? JSON.stringify(z.power.zones)      : null,
    updated_at:  Math.floor(Date.now() / 1000),
  };

  await db
    .insert(athleteZones)
    .values(values)
    .onConflictDoUpdate({ target: athleteZones.user_id, set: values });
}

export async function getAthleteZones(userId: number): Promise<DbAthleteZones | null> {
  const rows = await db
    .select()
    .from(athleteZones)
    .where(eq(athleteZones.user_id, userId))
    .limit(1);
  return rows[0] ?? null;
}
