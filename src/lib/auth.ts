import { cookies } from 'next/headers';
import { getUserById } from '@/lib/db';
import type { AppUser } from '@/lib/db';

const COOKIE_NAME = 'forza_session';

interface SessionCookie {
  userId: number;
}

export async function getSession(): Promise<AppUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  let parsed: SessionCookie;
  try {
    parsed = JSON.parse(raw) as SessionCookie;
  } catch {
    return null;
  }

  return await getUserById(parsed.userId);
}

export async function setSessionCookie(userId: number) {
  const cookieStore = await cookies();
  const value: SessionCookie = { userId };
  cookieStore.set(COOKIE_NAME, JSON.stringify(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
