import { PGDATABASE, PGHOST, PGPASSWORD, PGUSER } from "$env/static/private";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const postgresClient = postgres({
  username: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  database: PGDATABASE,
  ssl: "require",
});

export const db = drizzle(postgresClient, { schema });
