import { pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { configsTable } from "./config";
import { productsTable } from "./product";
import { relations } from "drizzle-orm";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").notNull(),
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
  },
  (table) => {
    return {
      primaryKey: primaryKey({
        name: "users_pkey",
        columns: [table.id],
      }),
    };
  },
);

export const usersRelations = relations(usersTable, ({ one, many }) => {
  return {
    config: one(configsTable),
    products: many(productsTable),
  };
});
