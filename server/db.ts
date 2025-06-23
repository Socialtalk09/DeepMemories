import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

// Configure Neon for HTTP instead of WebSocket to avoid connection issues
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Initializing database connection with HTTP adapter...");

// Use HTTP connection instead of WebSocket pool to avoid connection issues
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

console.log("Database configuration complete");
