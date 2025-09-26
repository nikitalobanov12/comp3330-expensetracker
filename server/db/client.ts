import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Define it in your environment before using the database client.");
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export { schema };
