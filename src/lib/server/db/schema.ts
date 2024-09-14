import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    email: varchar("email", {
      length: 255,
    })
      .notNull()
      .unique("users_email_unique"),
    username: varchar("username", {
      length: 25,
    })
      .notNull()
      .unique("users_username_unique"),
    passwordHash: varchar("password_hash", {
      length: 255,
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => {
    return {
      usersEmailIndex: index("users_email_idx").on(table.email),
      usersUsernameIndex: index("users_username_idx").on(table.username),
    };
  },
);

export const accessTokens = pgTable("access_tokens", {
  token: text("token").primaryKey(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});
