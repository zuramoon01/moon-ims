import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    database: process.env.PGDATABASE as string,
    host: process.env.PGHOST as string,
    password: process.env.PGPASSWORD as string,
    user: process.env.PGUSER as string,
  },
});
