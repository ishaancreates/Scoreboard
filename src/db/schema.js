import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

export const matchesTable = pgTable("matches", {
  id: serial("id").primaryKey(),
  sport: varchar("sport", { length: 50 }).notNull(),
  homeTeam: varchar("home_team", { length: 100 }).notNull(),
  awayTeam: varchar("away_team", { length: 100 }).notNull(),
  status: matchStatusEnum("status").notNull().default("scheduled"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});

/**
 * Commentary Table
 * Stores real-time commentary and events for each match
 * Tracks detailed ball-by-ball or play-by-play information
 */
export const commentaryTable = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .notNull()
    .references(() => matchesTable.id, { onDelete: "cascade" }),
  minute: integer("minute").notNull(),
  sequence: integer("sequence").notNull(),
  period: varchar("period", { length: 50 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  actor: varchar("actor", { length: 100 }),
  team: varchar("team", { length: 100 }),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  tags: text("tags"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});
