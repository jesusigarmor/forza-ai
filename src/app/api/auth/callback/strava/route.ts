import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { exchangeCodeForTokens } from '@/lib/strava';
import { runMigrations, upsertStravaConnection } from '@/lib/db';
import { getSession } from '@/lib/auth';

runMigrations();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (error) {
    return NextResponse.redirect(new URL('/settings?error=access_denied', request.url));
  }

  // Validate CSRF state and extract userId
  const cookieStore = await cookies();
  const stored = cookieStore.get('forza_oauth_state')?.value;
  const parts = stored?.split('.') ?? [];
  const [storedState, storedSig, storedUserId] = parts;

  const expectedSig = crypto
    .createHmac('sha256', process.env.COOKIE_SECRET!)
    .update(storedState ?? '')
    .digest('hex');

  let stateValid = false;
  try {
    stateValid =
      !!storedState &&
      crypto.timingSafeEqual(Buffer.from(storedSig ?? ''), Buffer.from(expectedSig));
  } catch {
    stateValid = false;
  }

  if (!stateValid || state !== storedState || !storedUserId) {
    return NextResponse.redirect(new URL('/settings?error=invalid_state', request.url));
  }

  // Verify the session user matches the one who initiated the OAuth flow
  const user = await getSession();
  if (!user || String(user.id) !== storedUserId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { access_token, refresh_token, expires_at, athlete } =
      await exchangeCodeForTokens(code!);

    upsertStravaConnection(user.id, athlete, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at,
    });

    cookieStore.delete('forza_oauth_state');
    return NextResponse.redirect(new URL('/dashboard?connected=true', request.url));
  } catch {
    return NextResponse.redirect(new URL('/settings?error=auth_failed', request.url));
  }
}
