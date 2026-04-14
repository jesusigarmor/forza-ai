CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"strava_id" bigint NOT NULL,
	"name" text NOT NULL,
	"sport_type" text NOT NULL,
	"start_date" text NOT NULL,
	"distance_km" real DEFAULT 0 NOT NULL,
	"moving_time" integer DEFAULT 0 NOT NULL,
	"elapsed_time" integer DEFAULT 0 NOT NULL,
	"elevation_gain" real,
	"avg_heartrate" real,
	"max_heartrate" real,
	"avg_watts" real,
	"weighted_avg_watts" real,
	"kilojoules" real,
	"avg_cadence" real,
	"calories" real,
	"suffer_score" integer,
	"pr_count" integer DEFAULT 0,
	"max_speed" real,
	"average_speed" real,
	"elev_high" real,
	"elev_low" real,
	"achievement_count" integer DEFAULT 0,
	"workout_type" integer,
	"trainer" integer DEFAULT 0,
	"average_temp" integer,
	"description" text,
	"perceived_exertion" real,
	"device_name" text,
	"detail_fetched" integer DEFAULT 0,
	"created_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	"updated_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	CONSTRAINT "activities_strava_id_unique" UNIQUE("strava_id")
);
--> statement-breakpoint
CREATE TABLE "activity_best_efforts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"strava_activity_id" bigint NOT NULL,
	"name" text NOT NULL,
	"elapsed_time" integer NOT NULL,
	"moving_time" integer NOT NULL,
	"distance" real NOT NULL,
	"pr_rank" integer,
	"start_date" text
);
--> statement-breakpoint
CREATE TABLE "athlete_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"ytd_run_distance" real,
	"ytd_run_count" integer,
	"ytd_run_time" integer,
	"ytd_run_elevation" real,
	"ytd_ride_distance" real,
	"ytd_ride_count" integer,
	"ytd_ride_time" integer,
	"ytd_ride_elevation" real,
	"ytd_swim_distance" real,
	"ytd_swim_count" integer,
	"ytd_swim_time" integer,
	"all_run_distance" real,
	"all_run_count" integer,
	"all_run_time" integer,
	"all_run_elevation" real,
	"all_ride_distance" real,
	"all_ride_count" integer,
	"all_ride_time" integer,
	"all_ride_elevation" real,
	"all_swim_distance" real,
	"all_swim_count" integer,
	"all_swim_time" integer,
	"biggest_ride_distance" real,
	"biggest_climb_elevation" real,
	"updated_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	CONSTRAINT "athlete_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "athlete_zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hr_zones" text,
	"power_zones" text,
	"updated_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	CONSTRAINT "athlete_zones_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_best_efforts" ADD CONSTRAINT "activity_best_efforts_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_stats" ADD CONSTRAINT "athlete_stats_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_zones" ADD CONSTRAINT "athlete_zones_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;