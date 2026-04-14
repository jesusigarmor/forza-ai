import { pgTable, serial, text, integer, real, bigint } from 'drizzle-orm/pg-core';
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

export const activities = pgTable('activities', {
  id:             serial('id').primaryKey(),
  user_id:        integer('user_id').notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  strava_id:      bigint('strava_id', { mode: 'number' }).unique().notNull(),
  name:           text('name').notNull(),
  sport_type:     text('sport_type').notNull(),
  start_date:     text('start_date').notNull(),
  distance_km:    real('distance_km').notNull().default(0),
  moving_time:    integer('moving_time').notNull().default(0),    // seconds
  elapsed_time:   integer('elapsed_time').notNull().default(0),   // seconds
  elevation_gain: real('elevation_gain'),
  avg_heartrate:  real('avg_heartrate'),
  max_heartrate:  real('max_heartrate'),
  avg_watts:      real('avg_watts'),
  weighted_avg_watts: real('weighted_avg_watts'),
  kilojoules:     real('kilojoules'),
  avg_cadence:    real('avg_cadence'),
  calories:       real('calories'),
  suffer_score:   integer('suffer_score'),
  pr_count:       integer('pr_count').default(0),
  // Extended list-endpoint fields
  max_speed:          real('max_speed'),               // m/s
  average_speed:      real('average_speed'),           // m/s
  elev_high:          real('elev_high'),               // meters MSL
  elev_low:           real('elev_low'),                // meters MSL
  achievement_count:  integer('achievement_count').default(0),
  workout_type:       integer('workout_type'),         // 0=default,1=race,2=long,3=workout
  trainer:            integer('trainer').default(0),   // 1=indoor trainer
  // Detail-endpoint fields (fetched separately)
  average_temp:       integer('average_temp'),         // celsius
  description:        text('description'),
  perceived_exertion: real('perceived_exertion'),      // RPE 1–10
  device_name:        text('device_name'),
  detail_fetched:     integer('detail_fetched').default(0), // 1 once detail endpoint called
  created_at:     integer('created_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
  updated_at:     integer('updated_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
});

export const activityBestEfforts = pgTable('activity_best_efforts', {
  id:                  serial('id').primaryKey(),
  user_id:             integer('user_id').notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  strava_activity_id:  bigint('strava_activity_id', { mode: 'number' }).notNull(),
  name:                text('name').notNull(),      // "400m","1 mile","5k","10k","Half-Marathon","Marathon"
  elapsed_time:        integer('elapsed_time').notNull(),  // seconds
  moving_time:         integer('moving_time').notNull(),
  distance:            real('distance').notNull(),         // meters
  pr_rank:             integer('pr_rank'),                 // 1=all-time PR, 2=season PR, null=not PR
  start_date:          text('start_date'),
});

export const athleteStats = pgTable('athlete_stats', {
  id:      serial('id').primaryKey(),
  user_id: integer('user_id').notNull().unique().references(() => appUsers.id, { onDelete: 'cascade' }),
  // Year-to-date
  ytd_run_distance:    real('ytd_run_distance'),
  ytd_run_count:       integer('ytd_run_count'),
  ytd_run_time:        integer('ytd_run_time'),
  ytd_run_elevation:   real('ytd_run_elevation'),
  ytd_ride_distance:   real('ytd_ride_distance'),
  ytd_ride_count:      integer('ytd_ride_count'),
  ytd_ride_time:       integer('ytd_ride_time'),
  ytd_ride_elevation:  real('ytd_ride_elevation'),
  ytd_swim_distance:   real('ytd_swim_distance'),
  ytd_swim_count:      integer('ytd_swim_count'),
  ytd_swim_time:       integer('ytd_swim_time'),
  // All-time
  all_run_distance:    real('all_run_distance'),
  all_run_count:       integer('all_run_count'),
  all_run_time:        integer('all_run_time'),
  all_run_elevation:   real('all_run_elevation'),
  all_ride_distance:   real('all_ride_distance'),
  all_ride_count:      integer('all_ride_count'),
  all_ride_time:       integer('all_ride_time'),
  all_ride_elevation:  real('all_ride_elevation'),
  all_swim_distance:   real('all_swim_distance'),
  all_swim_count:      integer('all_swim_count'),
  all_swim_time:       integer('all_swim_time'),
  // Bests
  biggest_ride_distance:   real('biggest_ride_distance'),
  biggest_climb_elevation: real('biggest_climb_elevation'),
  updated_at: integer('updated_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
});

export const athleteZones = pgTable('athlete_zones', {
  id:          serial('id').primaryKey(),
  user_id:     integer('user_id').notNull().unique().references(() => appUsers.id, { onDelete: 'cascade' }),
  hr_zones:    text('hr_zones'),    // JSON [{min,max},…] — 5 HR zones
  power_zones: text('power_zones'), // JSON [{min,max},…] — FTP-derived power zones
  updated_at:  integer('updated_at').notNull().default(sql`EXTRACT(EPOCH FROM NOW())::INTEGER`),
});
