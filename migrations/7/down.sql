
-- Remove sample prices
DELETE FROM prices_eod WHERE source = 'initial_data';

-- Remove sample instruments  
DELETE FROM instruments WHERE symbol IN ('RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'HINDUNILVR', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'KOTAKBANK');
