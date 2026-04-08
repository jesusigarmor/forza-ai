import { db } from './client';

export function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_users (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      name             TEXT NOT NULL,
      email            TEXT UNIQUE NOT NULL,
      password_hash    TEXT NOT NULL,
      sport_preference TEXT,
      age              INTEGER,
      weight_kg        REAL,
      height_cm        REAL,
      created_at       INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at       INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS strava_connections (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id        INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      strava_id      INTEGER UNIQUE NOT NULL,
      username       TEXT,
      firstname      TEXT,
      lastname       TEXT,
      profile        TEXT,
      profile_medium TEXT,
      access_token   TEXT NOT NULL,
      refresh_token  TEXT NOT NULL,
      expires_at     INTEGER NOT NULL,
      created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at     INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
}
