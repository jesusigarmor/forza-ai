import { pgTable, serial, text, integer, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const appUsers = pgTable('app_users', {
  id:               serial('id').primaryKey(),
  name:             text('name').notNull(),
  email:            text('email').unique().notNull(),
  password_hash:    text('password_hash').notNull(),
  sport_preference: text('sport_preference'),
  age:              integer('age'),
  weight_kg:        real('weight_kg'),
  height_cm:        real('height_cm'),
  created_at:       integer('created_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
  updated_at:       integer('updated_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
});

export const stravaConnections = pgTable('strava_connections', {
  id:             serial('id').primaryKey(),
  user_id:        integer('user_id').notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  strava_id:      integer('strava_id').unique().notNull(),
  username:       text('username'),
  firstname:      text('firstname'),
  lastname:       text('lastname'),
  profile:        text('profile'),
  profile_medium: text('profile_medium'),
  access_token:   text('access_token').notNull(),
  refresh_token:  text('refresh_token').notNull(),
  expires_at:     integer('expires_at').notNull(),
  created_at:     integer('created_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
  updated_at:     integer('updated_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
});
