import { db } from './client';
import { stravaConnections } from './schema';
import { eq, sql } from 'drizzle-orm';
import type { StravaAthlete } from '@/lib/types';

export type StravaConnection = typeof stravaConnections.$inferSelect;

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function upsertStravaConnection(
  userId: number,
  athlete: StravaAthlete,
  tokens: TokenData
): Promise<StravaConnection> {
  const rows = await db.insert(stravaConnections).values({
    user_id:        userId,
    strava_id:      athlete.id,
    username:       athlete.username,
    firstname:      athlete.firstname,
    lastname:       athlete.lastname,
    profile:        athlete.profile,
    profile_medium: athlete.profile_medium,
    access_token:   tokens.accessToken,
    refresh_token:  tokens.refreshToken,
    expires_at:     tokens.expiresAt,
  }).onConflictDoUpdate({
    target: stravaConnections.strava_id,
    set: {
      user_id:        userId,
      access_token:   tokens.accessToken,
      refresh_token:  tokens.refreshToken,
      expires_at:     tokens.expiresAt,
      firstname:      athlete.firstname,
      lastname:       athlete.lastname,
      profile:        athlete.profile,
      profile_medium: athlete.profile_medium,
      updated_at:     sql`EXTRACT(EPOCH FROM NOW())::INTEGER`,
    },
  }).returning();
  return rows[0]!;
}

export async function getStravaConnectionByUserId(userId: number): Promise<StravaConnection | null> {
  const rows = await db.select().from(stravaConnections)
    .where(eq(stravaConnections.user_id, userId)).limit(1);
  return rows[0] ?? null;
}

export async function updateStravaTokens(stravaId: number, tokens: TokenData): Promise<void> {
  await db.update(stravaConnections).set({
    access_token:  tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expires_at:    tokens.expiresAt,
    updated_at:    sql`EXTRACT(EPOCH FROM NOW())::INTEGER`,
  }).where(eq(stravaConnections.strava_id, stravaId));
}
