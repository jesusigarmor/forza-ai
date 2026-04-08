import type { StravaAthlete, Activity, SportType } from '@/lib/types';

const STRAVA_API = 'https://www.strava.com/api/v3';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';

// ─── Token exchange ───────────────────────────────────────────────────────────

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: StravaAthlete;
}

export async function exchangeCodeForTokens(code: string): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json() as Promise<StravaTokenResponse>;
}

// ─── Token refresh ────────────────────────────────────────────────────────────

interface StravaRefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export async function refreshAccessToken(refreshToken: string): Promise<StravaRefreshResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  return res.json() as Promise<StravaRefreshResponse>;
}

// ─── Activities ───────────────────────────────────────────────────────────────

interface GetActivitiesParams {
  per_page?: number;
  page?: number;
  before?: number;
  after?: number;
}

// Minimal shape of what Strava returns — only fields we use
export interface StravaRawActivity {
  id: number;
  name: string;
  sport_type: string;
  start_date_local: string;
  distance: number;       // meters
  moving_time: number;    // seconds
  elapsed_time: number;   // seconds
}

export async function getAthleteActivities(
  accessToken: string,
  params: GetActivitiesParams = {}
): Promise<StravaRawActivity[]> {
  const query = new URLSearchParams();
  if (params.per_page) query.set('per_page', String(params.per_page));
  if (params.page) query.set('page', String(params.page));
  if (params.before) query.set('before', String(params.before));
  if (params.after) query.set('after', String(params.after));

  const res = await fetch(`${STRAVA_API}/athlete/activities?${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 }, // always fresh
  });

  if (!res.ok) throw new Error(`Failed to fetch activities: ${res.status}`);
  return res.json() as Promise<StravaRawActivity[]>;
}

// ─── Data mapper ──────────────────────────────────────────────────────────────

const KNOWN_SPORT_TYPES = new Set<SportType>([
  'Run', 'Ride', 'Swim', 'TrailRun', 'Walk', 'Hike',
]);

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function formatPace(raw: StravaRawActivity): string {
  const sport = raw.sport_type as SportType;
  const distKm = raw.distance / 1000;

  if (distKm === 0 || raw.moving_time === 0) return '—';

  if (sport === 'Ride') {
    const speedKph = distKm / (raw.moving_time / 3600);
    return `${speedKph.toFixed(1)} km/h`;
  }

  // min/km for all others
  const secPerKm = raw.moving_time / distKm;
  const min = Math.floor(secPerKm / 60);
  const sec = Math.round(secPerKm % 60);
  return `${min}:${String(sec).padStart(2, '0')} /km`;
}

function formatDate(isoLocal: string): string {
  return new Date(isoLocal).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Fetch all activities from the past 1 year, paginating until exhausted
export async function fetchAllActivities(accessToken: string): Promise<StravaRawActivity[]> {
  const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
  const all: StravaRawActivity[] = [];
  let page = 1;

  while (true) {
    const batch = await getAthleteActivities(accessToken, {
      per_page: 200,
      page,
      after: oneYearAgo,
    });
    if (batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 200) break;
    page++;
  }

  return all;
}

export function mapStravaActivity(raw: StravaRawActivity): Activity {
  const sportType: SportType = KNOWN_SPORT_TYPES.has(raw.sport_type as SportType)
    ? (raw.sport_type as SportType)
    : 'Run';

  return {
    id: String(raw.id),
    sportType,
    name: raw.name,
    date: formatDate(raw.start_date_local),
    distance: Math.round((raw.distance / 1000) * 10) / 10,
    duration: formatDuration(raw.moving_time),
    pace: formatPace(raw),
  };
}
