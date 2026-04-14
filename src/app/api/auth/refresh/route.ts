import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { refreshAccessToken } from '@/lib/strava';
import { getStravaConnectionByUserId, updateStravaTokens } from '@/lib/db';

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.redirect(new URL('/login', request.url));

  const connection = await getStravaConnectionByUserId(user.id);
  if (!connection) return NextResponse.redirect(new URL('/dashboard', request.url));

  try {
    const { access_token, refresh_token, expires_at } = await refreshAccessToken(
      connection.refresh_token
    );
    await updateStravaTokens(connection.strava_id, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at,
    });
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const redirect = request.nextUrl.searchParams.get('redirect') ?? '/dashboard';
  const safe = redirect.startsWith('/') && !redirect.startsWith('//');
  return NextResponse.redirect(new URL(safe ? redirect : '/dashboard', request.url));
}
