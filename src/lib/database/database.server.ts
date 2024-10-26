import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.server";

export const db = drizzle({ connection: DATABASE_URL, schema });
