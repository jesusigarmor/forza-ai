import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getStravaConnectionByUserId, upsertActivities } from '@/lib/db';
import {
  getActivitiesNeedingDetail,
  applyActivityDetail,
  upsertBestEfforts,
} from '@/lib/db/activities';
import {
  upsertAthleteStats,
  upsertAthleteZones,
} from '@/lib/db/athlete-data';
import {
  fetchAllActivities,
  fetchActivityDetail,
  fetchAthleteStats,
  fetchAthleteZones,
  mapStravaActivity,
} from '@/lib/strava';
import { embedUserActivities } from '@/lib/embeddings';

// Strava allows 100 req/15min. We budget detail calls at ~500ms apart
// to stay well within limits alongside list + stats + zones calls.
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const connection = await getStravaConnectionByUserId(user.id);
  if (!connection)
    return NextResponse.json({ error: 'Strava not connected' }, { status: 400 });

  const token = connection.access_token;

  // ── 1. Fetch list activities + athlete stats/zones in parallel ────────────
  const [rawActivities, stravaStats, stravaZones] = await Promise.all([
    fetchAllActivities(token),
    fetchAthleteStats(token, connection.strava_id).catch(() => null),
    fetchAthleteZones(token).catch(() => null),
  ]);

  // ── 2. Persist list-endpoint data ─────────────────────────────────────────
  await upsertActivities(user.id, rawActivities);

  if (stravaStats) await upsertAthleteStats(user.id, stravaStats);
  if (stravaZones) await upsertAthleteZones(user.id, stravaZones);

  // ── 3. Embed activities in ChromaDB for AI chat ───────────────────────────
  const mappedActivities = rawActivities.map(mapStravaActivity);
  await embedUserActivities(user.id, mappedActivities);

  // ── 4. Fetch detailed activity data for best_efforts, description, etc. ───
  // Fetches up to 30 activities that haven't had detail endpoint called yet.
  // Subsequent syncs will progressively fill in older activities.
  const needsDetail = await getActivitiesNeedingDetail(user.id, 30);
  let detailsFetched = 0;

  for (const stravaId of needsDetail) {
    try {
      const detail = await fetchActivityDetail(token, stravaId);
      await applyActivityDetail(stravaId, detail);
      if (detail.best_efforts && detail.best_efforts.length > 0) {
        await upsertBestEfforts(user.id, stravaId, detail.best_efforts);
      }
      detailsFetched++;
    } catch {
      // Don't fail the whole sync if a single detail call fails
    }
    // Respect rate limits: 100 req/15min shared with list calls above
    await delay(500);
  }

  return NextResponse.json({
    synced:         rawActivities.length,
    detailsFetched,
    statsUpdated:   !!stravaStats,
    zonesUpdated:   !!stravaZones,
  });
}
