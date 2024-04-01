import {
  pgTableCreator,
} from "drizzle-orm/pg-core";
import pg from "pg";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { createSelectSchema } from "drizzle-typebox";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);


const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool);

// Auth tables
export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
  .notNull()
  .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const userSchema = createSelectSchema(userTable);