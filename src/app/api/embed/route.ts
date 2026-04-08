import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getStravaConnectionByUserId } from '@/lib/db';
import { fetchAllActivities, mapStravaActivity } from '@/lib/strava';
import { embedUserActivities } from '@/lib/embeddings';

export async function POST() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const connection = getStravaConnectionByUserId(user.id);
  if (!connection) return NextResponse.json({ error: 'Strava not connected' }, { status: 400 });

  const rawActivities = await fetchAllActivities(connection.access_token);
  const activities = rawActivities.map(mapStravaActivity);
  await embedUserActivities(user.id, activities);

  return NextResponse.json({ embedded: activities.length });
}
