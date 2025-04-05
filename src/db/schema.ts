import { integer, pgTable, serial, text, boolean, real, timestamp } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  position: text("position").notNull(),
  fatigue: real("fatigue").notNull(),
  performance: real("performance").notNull(),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  match_id: integer("match_id"),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  teamScore: integer("team_score").notNull(),
  opponentScore: integer("opponent_score").notNull(),
  opponent: text("opponent").notNull(),
  venue: text("venue").notNull(),
});

export const teamLineup = pgTable("team_lineup", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  playing: boolean("playing").default(false),
  substitution: boolean("substitution").default(false),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  playerId: integer("player_id").references(() => players.id),
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