import { db } from './client';
import { appUsers } from './schema';
import { eq } from 'drizzle-orm';

export type AppUser = typeof appUsers.$inferSelect;

interface CreateUserData {
  name: string;
  email: string;
  password_hash: string;
  sport_preference?: string;
  age?: number;
  weight_kg?: number;
  height_cm?: number;
}

export async function createUser(data: CreateUserData): Promise<AppUser> {
  const rows = await db.insert(appUsers).values({
    name:             data.name,
    email:            data.email,
    password_hash:    data.password_hash,
    sport_preference: data.sport_preference ?? null,
    age:              data.age ?? null,
    weight_kg:        data.weight_kg ?? null,
    height_cm:        data.height_cm ?? null,
  }).returning();
  return rows[0]!;
}

export async function getUserByEmail(email: string): Promise<AppUser | null> {
  const rows = await db.select().from(appUsers).where(eq(appUsers.email, email)).limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: number): Promise<AppUser | null> {
  const rows = await db.select().from(appUsers).where(eq(appUsers.id, id)).limit(1);
  return rows[0] ?? null;
}
