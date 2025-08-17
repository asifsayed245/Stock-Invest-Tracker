
-- Remove sample data
DELETE FROM prices_eod WHERE source = 'manual';
DELETE FROM instruments WHERE exchange = 'NSE';
