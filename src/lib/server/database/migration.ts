import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const postgresClient = postgres(process.env.DATABASE_URL as string, { max: 1 });

const db = drizzle(postgresClient, { schema });

await migrate(db, { migrationsFolder: "./drizzle" });

await postgresClient.end();
