
-- Remove sample data
DELETE FROM prices_eod WHERE source = 'manual';
DELETE FROM instruments WHERE symbol IN ('RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'BAJFINANCE');
