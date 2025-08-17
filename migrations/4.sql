
-- Add unique constraint to holdings table to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_holdings_unique ON holdings(user_id, instrument_id, COALESCE(account_id, 0));
