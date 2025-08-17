
-- Dividend payments
CREATE TABLE dividends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  instrument_id INTEGER NOT NULL,
  date DATE NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Current holdings
CREATE TABLE holdings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  account_id INTEGER,
  instrument_id INTEGER NOT NULL,
  qty REAL NOT NULL,
  avg_cost REAL,
  mv_local REAL,
  last_price REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Statement upload tracking
CREATE TABLE statements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  broker_code TEXT,
  status TEXT DEFAULT 'pending',
  error_summary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Import job tracking
CREATE TABLE imports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  statement_id INTEGER,
  rows_total INTEGER DEFAULT 0,
  rows_parsed INTEGER DEFAULT 0,
  rows_flagged INTEGER DEFAULT 0,
  rows_committed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit trail
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  before_data TEXT,
  after_data TEXT,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP
);
