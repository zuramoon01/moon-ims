import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const configsTable = pgTable(
  "configs",
  {
    id: integer("id").notNull().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
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
        name: "configs_pkey",
        columns: [table.id],
      }),
      userReference: foreignKey({
        name: "configs_user_id_fkey",
        columns: [table.userId],
        foreignColumns: [usersTable.id],
      }).onDelete("cascade"),
    };
  },
);

export const configsRelations = relations(configsTable, ({ one }) => {
  return {
    user: one(usersTable, {
      fields: [configsTable.userId],
      references: [usersTable.id],
    }),
  };
});
