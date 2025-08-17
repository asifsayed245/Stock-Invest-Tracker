
-- Users table with base currency and timezone
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  base_currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Broker accounts
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  broker_code TEXT,
  display_name TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  external_account_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Financial instruments
CREATE TABLE instruments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  exchange TEXT,
  name TEXT,
  currency TEXT DEFAULT 'USD',
  isin TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- End of day prices
CREATE TABLE prices_eod (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instrument_id INTEGER NOT NULL,
  date DATE NOT NULL,
  close REAL,
  adjusted_close REAL,
  source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Foreign exchange rates
CREATE TABLE fx_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  base TEXT NOT NULL,
  quote TEXT NOT NULL,
  date DATE NOT NULL,
  rate REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stock transactions
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  account_id INTEGER,
  instrument_id INTEGER NOT NULL,
  side TEXT NOT NULL, -- BUY or SELL
  qty REAL NOT NULL,
  price REAL NOT NULL,
  fees REAL DEFAULT 0,
  trade_date DATE NOT NULL,
  settle_date DATE,
  source TEXT DEFAULT 'manual',
  import_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
