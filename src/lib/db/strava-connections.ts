import { db } from './client';
import type { StravaAthlete } from '@/lib/types';

export interface StravaConnection {
  id: number;
  user_id: number;
  strava_id: number;
  username: string | null;
  firstname: string;
  lastname: string;
  profile: string | null;
  profile_medium: string | null;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  created_at: number;
  updated_at: number;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export function upsertStravaConnection(
  userId: number,
  athlete: StravaAthlete,
  tokens: TokenData
): StravaConnection {
  return db
    .prepare(
      `INSERT INTO strava_connections (user_id, strava_id, username, firstname, lastname, profile, profile_medium, access_token, refresh_token, expires_at)
       VALUES (@userId, @stravaId, @username, @firstname, @lastname, @profile, @profileMedium, @accessToken, @refreshToken, @expiresAt)
       ON CONFLICT(strava_id) DO UPDATE SET
         user_id        = excluded.user_id,
         access_token   = excluded.access_token,
         refresh_token  = excluded.refresh_token,
         expires_at     = excluded.expires_at,
         firstname      = excluded.firstname,
         lastname       = excluded.lastname,
         profile        = excluded.profile,
         profile_medium = excluded.profile_medium,
         updated_at     = unixepoch()
       RETURNING *`
    )
    .get({
      userId,
      stravaId: athlete.id,
      username: athlete.username,
      firstname: athlete.firstname,
      lastname: athlete.lastname,
      profile: athlete.profile,
      profileMedium: athlete.profile_medium,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    }) as StravaConnection;
}

export function getStravaConnectionByUserId(userId: number): StravaConnection | null {
  return (
    (db
      .prepare('SELECT * FROM strava_connections WHERE user_id = ?')
      .get(userId) as StravaConnection) ?? null
  );
}

export function updateStravaTokens(stravaId: number, tokens: TokenData) {
  db.prepare(
    `UPDATE strava_connections SET access_token = ?, refresh_token = ?, expires_at = ?, updated_at = unixepoch()
     WHERE strava_id = ?`
  ).run(tokens.accessToken, tokens.refreshToken, tokens.expiresAt, stravaId);
}
