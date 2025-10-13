import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  // Performance optimizations for production
  max: 50, // Maximum 50 connections in pool (up from default 10)
  min: 5,  // Minimum 5 idle connections (faster response time)
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Connection timeout: 5s
  maxUses: 7500, // Recycle connection after 7500 uses
});

export const db = drizzle(pool, { schema });
