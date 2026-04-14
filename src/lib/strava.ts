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

// Full shape of what Strava returns from the list endpoint (SummaryActivity)
export interface StravaRawActivity {
  id: number;
  name: string;
  sport_type: string;
  start_date_local: string;
  distance: number;                    // meters
  moving_time: number;                 // seconds
  elapsed_time: number;                // seconds
  total_elevation_gain?: number;       // meters
  average_heartrate?: number;          // bpm
  max_heartrate?: number;
  average_watts?: number;              // watts (power meter)
  weighted_average_watts?: number;     // normalized power
  kilojoules?: number;
  average_cadence?: number;
  calories?: number;
  suffer_score?: number;
  pr_count?: number;
  // Extended list-endpoint fields
  max_speed?: number;                  // m/s
  average_speed?: number;             // m/s
  elev_high?: number;                 // highest point, meters MSL
  elev_low?: number;                  // lowest point, meters MSL
  achievement_count?: number;
  workout_type?: number;              // 0=default,1=race,2=long,3=workout
  trainer?: boolean;                  // true = indoor trainer
}

// Additional fields only returned by GET /activities/{id}
export interface StravaDetailedActivity extends StravaRawActivity {
  average_temp?: number;              // celsius
  description?: string;
  perceived_exertion?: number;        // RPE 1–10
  device_name?: string;
  best_efforts?: StravaBestEffort[];
}

export interface StravaBestEffort {
  name: string;                       // "400m","1 mile","5k","10k","Half-Marathon","Marathon"
  elapsed_time: number;               // seconds
  moving_time: number;
  distance: number;                   // meters
  start_date?: string;
  pr_rank?: number | null;            // 1=all-time PR, 2=season PR, null=not a PR
}

export interface StravaAthleteStats {
  recent_run_totals:  StravaTotals;
  ytd_run_totals:     StravaTotals;
  all_run_totals:     StravaTotals;
  recent_ride_totals: StravaTotals;
  ytd_ride_totals:    StravaTotals;
  all_ride_totals:    StravaTotals;
  recent_swim_totals: StravaTotals;
  ytd_swim_totals:    StravaTotals;
  all_swim_totals:    StravaTotals;
  biggest_ride_distance:        number;
  biggest_climb_elevation_gain: number;
}

export interface StravaTotals {
  count:             number;
  distance:          number;   // meters
  moving_time:       number;   // seconds
  elapsed_time:      number;
  elevation_gain:    number;
  achievement_count: number;
}

export interface StravaAthleteZones {
  heart_rate?: {
    custom_zones: boolean;
    zones: { min: number; max: number }[];
  };
  power?: {
    zones: { min: number; max: number }[];
  };
}

export async function getAthleteActivities(
  accessToken: string,
  params: GetActivitiesParams = {}
): Promise<StravaRawActivity[]> {
  const query = new URLSearchParams();
  if (params.per_page) query.set('per_page', String(params.per_page));
  if (params.page)     query.set('page',     String(params.page));
  if (params.before)   query.set('before',   String(params.before));
  if (params.after)    query.set('after',    String(params.after));

  const res = await fetch(`${STRAVA_API}/athlete/activities?${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error(`Failed to fetch activities: ${res.status}`);
  return res.json() as Promise<StravaRawActivity[]>;
}

export async function fetchActivityDetail(
  accessToken: string,
  activityId: number
): Promise<StravaDetailedActivity> {
  const res = await fetch(`${STRAVA_API}/activities/${activityId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Failed to fetch activity detail ${activityId}: ${res.status}`);
  return res.json() as Promise<StravaDetailedActivity>;
}

export async function fetchAthleteStats(
  accessToken: string,
  athleteId: number
): Promise<StravaAthleteStats> {
  const res = await fetch(`${STRAVA_API}/athletes/${athleteId}/stats`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Failed to fetch athlete stats: ${res.status}`);
  return res.json() as Promise<StravaAthleteStats>;
}

export async function fetchAthleteZones(accessToken: string): Promise<StravaAthleteZones> {
  const res = await fetch(`${STRAVA_API}/athlete/zones`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Failed to fetch athlete zones: ${res.status}`);
  return res.json() as Promise<StravaAthleteZones>;
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

// ─── Formatting helpers (exported for reuse in dashboard/db mapping) ──────────

const KNOWN_SPORT_TYPES = new Set<SportType>([
  'Run', 'Ride', 'Swim', 'TrailRun', 'Walk', 'Hike',
]);

export function normalizeSportType(raw: string): SportType {
  return KNOWN_SPORT_TYPES.has(raw as SportType) ? (raw as SportType) : 'Run';
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function formatPaceDisplay(
  sportType: string,
  distanceKm: number,
  movingTimeSec: number
): string {
  if (distanceKm === 0 || movingTimeSec === 0) return '—';

  if (sportType === 'Ride') {
    const speedKph = distanceKm / (movingTimeSec / 3600);
    return `${speedKph.toFixed(1)} km/h`;
  }

  const secPerKm = movingTimeSec / distanceKm;
  const min = Math.floor(secPerKm / 60);
  const sec = Math.round(secPerKm % 60);
  return `${min}:${String(sec).padStart(2, '0')} /km`;
}

export function formatActivityDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Data mapper (for chat/embedding use) ────────────────────────────────────

export function mapStravaActivity(raw: StravaRawActivity): Activity {
  return {
    id:        String(raw.id),
    sportType: normalizeSportType(raw.sport_type),
    name:      raw.name,
    date:      formatActivityDate(raw.start_date_local),
    distance:  Math.round((raw.distance / 1000) * 10) / 10,
    duration:  formatDuration(raw.moving_time),
    pace:      formatPaceDisplay(raw.sport_type, raw.distance / 1000, raw.moving_time),
  };
}
