import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Allow running without a database in development; storage falls back to in-memory.
  // Database-backed storage methods must not be used without a configured database.
  console.warn(
    "DATABASE_URL not set. Running without PostgreSQL (development mode). Set DATABASE_URL to enable database storage.",
  );
}

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : (undefined as unknown as Pool);

export const db = databaseUrl
  ? drizzle({ client: pool, schema })
  : (undefined as unknown as ReturnType<typeof drizzle>);