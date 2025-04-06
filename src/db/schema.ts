import { pgTable, serial, varchar, integer, timestamp, boolean, jsonb, text, real } from "drizzle-orm/pg-core";

// Players table
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age"),
  position: varchar("position", { length: 50 }).notNull(),
  nationality: varchar("nationality", { length: 50 }),
  team: varchar("team", { length: 100 }),
  photo: varchar("photo", { length: 255 }),
  ability: real("ability"),
  stamina: real("stamina"),
  healthCondition: varchar("health_condition", { length: 100 }),
  performance: real("performance"),
  matchLoad: real("match_load"),
  averageRating: real("average_rating"),
  hoursPlayed: real("hours_played"),
  fatiguePercentage: real("fatigue_percentage"),
  fitnessLevel: real("fitness_level"),
  condition: varchar("condition", { length: 50 }),
  playing: boolean("playing").default(false),
  injured: boolean("injured").default(false),
  injuredTime: integer("injured_time"),
  injuredReason: varchar("injured_reason", { length: 255 }),
  timeForRecover: integer("time_for_recover"),
  stats: jsonb("stats"),
  rating: jsonb("rating"),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nationality: varchar("nationality", { length: 50 }),
  photo: varchar("photo", { length: 255 }),
  coach: varchar("coach", { length: 100 }),
  stadium: varchar("stadium", { length: 100 }),
  formation: varchar("formation", { length: 20 }),
  rating: real("rating"),
  points: integer("points").default(0),
  goalsScored: integer("goals_scored").default(0),
  goalsConceded: integer("goals_conceded").default(0),
  matchesPlayed: integer("matches_played").default(0),
  matchesWon: integer("matches_won").default(0),
  matchesLost: integer("matches_lost").default(0),
  matchesDrawn: integer("matches_drawn").default(0),
  matchesPlayedHome: integer("matches_played_home").default(0),
  matchesPlayedAway: integer("matches_played_away").default(0),
  matchesWonHome: integer("matches_won_home").default(0),
  matchesWonAway: integer("matches_won_away").default(0),
  matchesLostHome: integer("matches_lost_home").default(0),
  matchesLostAway: integer("matches_lost_away").default(0),
  matchesDrawnHome: integer("matches_drawn_home").default(0),
  matchesDrawnAway: integer("matches_drawn_away").default(0),
  lastMatchPlayed: varchar("last_match_played", { length: 100 }),
  nextMatch: varchar("next_match", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Matches table
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  homeTeamId: integer("home_team_id").references(() => teams.id),
  awayTeamId: integer("away_team_id").references(() => teams.id),
  isFinished: boolean("is_finished").default(false),
  homeTeamScore: integer("home_team_score"),
  awayTeamScore: integer("away_team_score"),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team Lineups table
export const teamLineups = pgTable("team_lineups", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id),
  teamId: integer("team_id").references(() => teams.id),
  formation: varchar("formation", { length: 20 }).notNull(),
  players: jsonb("players").notNull(),
  isConfirmed: boolean("is_confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Player Performances table
export const playerPerformances = pgTable("player_performances", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  matchId: integer("match_id").references(() => matches.id),
  stats: jsonb("stats").notNull(),
  rating: real("rating"),
  minutesPlayed: integer("minutes_played"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  title: varchar("title", { length: 100 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playerStatistics = pgTable("player_statistics", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  pace: integer("pace").notNull(),
  shooting: integer("shooting").notNull(),
  passing: integer("passing").notNull(),
  dribbling: integer("dribbling").notNull(),
  defending: integer("defending").notNull(),
  physical: integer("physical").notNull(),
});