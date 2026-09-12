// SQLite connection + schema migration for Campus Grounds.
// Cached on globalThis so Next.js hot reloads don't open a new handle.

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "campus-grounds.db");
const SCHEMA_PATH = path.join(process.cwd(), "lib", "schema.sql");

declare global {
  // eslint-disable-next-line no-var
  var __cafeDb: Database.Database | undefined;
}

export function migrate(db: Database.Database): void {
  const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
  db.exec(sql);
}

/** Fresh in-memory database with schema applied — for unit tests. */
export function createTestDb(): Database.Database {
  const db = new Database(":memory:");
  migrate(db);
  return db;
}

export function getDb(): Database.Database {
  if (globalThis.__cafeDb) return globalThis.__cafeDb;

  fs.mkdirSync(DB_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  migrate(db);
  globalThis.__cafeDb = db;
  return db;
}
