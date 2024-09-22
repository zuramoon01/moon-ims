import postgres from "postgres";
import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const postgresClient = postgres(DATABASE_URL);

export const db = drizzle(postgresClient, { schema });
