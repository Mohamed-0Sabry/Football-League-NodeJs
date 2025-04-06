CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_team_id" integer,
	"away_team_id" integer,
	"is_finished" boolean DEFAULT false,
	"home_team_score" integer,
	"away_team_score" integer,
	"date" timestamp NOT NULL,
	"location" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer,
	"title" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_performances" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer,
	"match_id" integer,
	"stats" jsonb NOT NULL,
	"rating" real,
	"minutes_played" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_statistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer,
	"pace" integer NOT NULL,
	"shooting" integer NOT NULL,
	"passing" integer NOT NULL,
	"dribbling" integer NOT NULL,
	"defending" integer NOT NULL,
	"physical" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer,
	"position" varchar(50) NOT NULL,
	"nationality" varchar(50),
	"team" varchar(100),
	"photo" varchar(255),
	"ability" real,
	"stamina" real,
	"health_condition" varchar(100),
	"performance" real,
	"match_load" real,
	"average_rating" real,
	"hours_played" real,
	"fatigue_percentage" real,
	"fitness_level" real,
	"condition" varchar(50),
	"playing" boolean DEFAULT false,
	"injured" boolean DEFAULT false,
	"injured_time" integer,
	"injured_reason" varchar(255),
	"time_for_recover" integer,
	"stats" jsonb,
	"rating" jsonb,
	"goals" integer DEFAULT 0,
	"assists" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team_lineups" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer,
	"team_id" integer,
	"formation" varchar(20) NOT NULL,
	"players" jsonb NOT NULL,
	"is_confirmed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"nationality" varchar(50),
	"photo" varchar(255),
	"coach" varchar(100),
	"stadium" varchar(100),
	"formation" varchar(20),
	"rating" real,
	"points" integer DEFAULT 0,
	"goals_scored" integer DEFAULT 0,
	"goals_conceded" integer DEFAULT 0,
	"matches_played" integer DEFAULT 0,
	"matches_won" integer DEFAULT 0,
	"matches_lost" integer DEFAULT 0,
	"matches_drawn" integer DEFAULT 0,
	"matches_played_home" integer DEFAULT 0,
	"matches_played_away" integer DEFAULT 0,
	"matches_won_home" integer DEFAULT 0,
	"matches_won_away" integer DEFAULT 0,
	"matches_lost_home" integer DEFAULT 0,
	"matches_lost_away" integer DEFAULT 0,
	"matches_drawn_home" integer DEFAULT 0,
	"matches_drawn_away" integer DEFAULT 0,
	"last_match_played" varchar(100),
	"next_match" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_performances" ADD CONSTRAINT "player_performances_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_performances" ADD CONSTRAINT "player_performances_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_lineups" ADD CONSTRAINT "team_lineups_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_lineups" ADD CONSTRAINT "team_lineups_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;