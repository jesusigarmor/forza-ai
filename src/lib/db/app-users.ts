import { db } from './client';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  sport_preference: string | null;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  created_at: number;
  updated_at: number;
}

interface CreateUserData {
  name: string;
  email: string;
  password_hash: string;
  sport_preference?: string;
  age?: number;
  weight_kg?: number;
  height_cm?: number;
}

export function createUser(data: CreateUserData): AppUser {
  return db
    .prepare(
      `INSERT INTO app_users (name, email, password_hash, sport_preference, age, weight_kg, height_cm)
       VALUES (@name, @email, @passwordHash, @sportPreference, @age, @weightKg, @heightCm)
       RETURNING *`
    )
    .get({
      name: data.name,
      email: data.email,
      passwordHash: data.password_hash,
      sportPreference: data.sport_preference ?? null,
      age: data.age ?? null,
      weightKg: data.weight_kg ?? null,
      heightCm: data.height_cm ?? null,
    }) as AppUser;
}

export function getUserByEmail(email: string): AppUser | null {
  return (db.prepare('SELECT * FROM app_users WHERE email = ?').get(email) as AppUser) ?? null;
}

export function getUserById(id: number): AppUser | null {
  return (db.prepare('SELECT * FROM app_users WHERE id = ?').get(id) as AppUser) ?? null;
}
