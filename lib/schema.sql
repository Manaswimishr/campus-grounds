-- Campus Grounds SQLite schema
-- Applied on startup by lib/db.ts (idempotent via IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  item TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK (priority IN (1, 2, 3)),
  timestamp INTEGER NOT NULL,
  is_faculty_delivery INTEGER NOT NULL DEFAULT 0,
  delivery_location TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'served'))
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS seats (
  row INTEGER NOT NULL,
  col INTEGER NOT NULL,
  occupied INTEGER NOT NULL DEFAULT 0 CHECK (occupied IN (0, 1)),
  PRIMARY KEY (row, col)
);

CREATE TABLE IF NOT EXISTS delivery_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination INTEGER NOT NULL,
  reachable INTEGER NOT NULL CHECK (reachable IN (0, 1)),
  distance INTEGER NOT NULL,
  path_json TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_delivery_requests_created
  ON delivery_requests(created_at);
