import { NextRequest, NextResponse } from 'next/server';
import { runMigrations, getUserByEmail } from '@/lib/db';
import { verifyPassword } from '@/lib/passwords';
import { setSessionCookie } from '@/lib/auth';

runMigrations();

export async function POST(request: NextRequest) {
  const body = await request.json() as { email?: string; password?: string };
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  await setSessionCookie(user.id);
  return NextResponse.json({ ok: true });
}
