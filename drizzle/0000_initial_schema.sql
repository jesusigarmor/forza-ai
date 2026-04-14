CREATE TABLE "app_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"sport_preference" text,
	"age" integer,
	"weight_kg" real,
	"height_cm" real,
	"created_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	"updated_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	CONSTRAINT "app_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "strava_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"strava_id" integer NOT NULL,
	"username" text,
	"firstname" text,
	"lastname" text,
	"profile" text,
	"profile_medium" text,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" integer NOT NULL,
	"created_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	"updated_at" integer DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER NOT NULL,
	CONSTRAINT "strava_connections_strava_id_unique" UNIQUE("strava_id")
);
--> statement-breakpoint
ALTER TABLE "strava_connections" ADD CONSTRAINT "strava_connections_user_id_app_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;