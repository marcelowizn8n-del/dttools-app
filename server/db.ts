import { Pool } from 'pg';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';

let db;
let pool;

if (process.env.NODE_ENV === 'test') {
  const sqlite = new Database(':memory:');
  db = drizzleSqlite(sqlite, { schema });
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set for non-test environments.');
  }
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  db = drizzleNode(pool, { schema });
}

export { db, pool };
