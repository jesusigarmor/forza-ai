import { db } from './client';
import type { StravaAthlete } from '@/lib/types';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UserRow {
  id: number;
  strava_id: number;
  username: string | null;
  firstname: string;
  lastname: string;
  profile: string | null;
  profile_medium: string | null;
  city: string | null;
  country: string | null;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  created_at: number;
  updated_at: number;
}

export function upsertUser(athlete: StravaAthlete, tokens: TokenData): UserRow {
  return db
    .prepare(
      `INSERT INTO users (strava_id, username, firstname, lastname, profile, profile_medium, city, country, access_token, refresh_token, expires_at)
       VALUES (@stravaId, @username, @firstname, @lastname, @profile, @profileMedium, @city, @country, @accessToken, @refreshToken, @expiresAt)
       ON CONFLICT(strava_id) DO UPDATE SET
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
      stravaId: athlete.id,
      username: athlete.username,
      firstname: athlete.firstname,
      lastname: athlete.lastname,
      profile: athlete.profile,
      profileMedium: athlete.profile_medium,
      city: athlete.city,
      country: athlete.country,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    }) as UserRow;
}

export function getUserById(id: number): UserRow | null {
  return (db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow) ?? null;
}

export function updateTokens(stravaId: number, tokens: TokenData) {
  db.prepare(
    `UPDATE users SET access_token = ?, refresh_token = ?, expires_at = ?, updated_at = unixepoch()
     WHERE strava_id = ?`
  ).run(tokens.accessToken, tokens.refreshToken, tokens.expiresAt, stravaId);
}
