import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL!));

  const state = crypto.randomBytes(16).toString('hex');
  const sig = crypto
    .createHmac('sha256', process.env.COOKIE_SECRET!)
    .update(state)
    .digest('hex');

  // Store state + userId so callback knows which user to link Strava to
  const cookieStore = await cookies();
  cookieStore.set('forza_oauth_state', `${state}.${sig}.${user.id}`, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/strava`,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all,profile:read_all',
    state,
  });

  return NextResponse.redirect(`https://www.strava.com/oauth/authorize?${params}`);
}
