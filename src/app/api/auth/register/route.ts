import { NextRequest, NextResponse } from 'next/server';
import { runMigrations, createUser, getUserByEmail } from '@/lib/db';
import { hashPassword } from '@/lib/passwords';
import { setSessionCookie } from '@/lib/auth';

runMigrations();

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    name?: string;
    email?: string;
    password?: string;
    sport_preference?: string;
    age?: number;
    weight_kg?: number;
    height_cm?: number;
  };

  const { name, email, password, sport_preference, age, weight_kg, height_cm } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
  }

  const password_hash = await hashPassword(password);
  const user = createUser({ name, email, password_hash, sport_preference, age, weight_kg, height_cm });

  await setSessionCookie(user.id);
  return NextResponse.json({ ok: true });
}
