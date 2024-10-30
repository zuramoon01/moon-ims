import { defineConfig } from "drizzle-kit";
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: "./src/lib/database/schema.server.ts",
  casing: "snake_case",
  verbose: true,
  strict: true,
  out: "./src/lib/database/migrations",
});
