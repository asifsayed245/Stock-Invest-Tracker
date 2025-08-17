
-- Add some sample Indian stocks with current prices
INSERT OR IGNORE INTO instruments (symbol, exchange, name, currency, status) VALUES 
('RELIANCE', 'NSE', 'Reliance Industries Ltd', 'INR', 'active'),
('TCS', 'NSE', 'Tata Consultancy Services', 'INR', 'active'),
('HDFCBANK', 'NSE', 'HDFC Bank Ltd', 'INR', 'active'),
('INFY', 'NSE', 'Infosys Ltd', 'INR', 'active'),
('HINDUNILVR', 'NSE', 'Hindustan Unilever Ltd', 'INR', 'active'),
('ICICIBANK', 'NSE', 'ICICI Bank Ltd', 'INR', 'active'),
('BHARTIARTL', 'NSE', 'Bharti Airtel Ltd', 'INR', 'active'),
('ITC', 'NSE', 'ITC Ltd', 'INR', 'active'),
('KOTAKBANK', 'NSE', 'Kotak Mahindra Bank', 'INR', 'active'),
('BAJFINANCE', 'NSE', 'Bajaj Finance Ltd', 'INR', 'active');

-- Add current prices for these stocks
INSERT OR IGNORE INTO prices_eod (instrument_id, date, close, adjusted_close, source) 
SELECT i.id, '2025-08-17', 
  CASE i.symbol
    WHEN 'RELIANCE' THEN 2856.35
    WHEN 'TCS' THEN 4167.20
    WHEN 'HDFCBANK' THEN 1731.85
    WHEN 'INFY' THEN 1845.30
    WHEN 'HINDUNILVR' THEN 2389.45
    WHEN 'ICICIBANK' THEN 1264.75
    WHEN 'BHARTIARTL' THEN 1678.90
    WHEN 'ITC' THEN 462.80
    WHEN 'KOTAKBANK' THEN 1781.25
    WHEN 'BAJFINANCE' THEN 6734.50
    ELSE 1000.00
  END,
  CASE i.symbol
    WHEN 'RELIANCE' THEN 2856.35
    WHEN 'TCS' THEN 4167.20
    WHEN 'HDFCBANK' THEN 1731.85
    WHEN 'INFY' THEN 1845.30
    WHEN 'HINDUNILVR' THEN 2389.45
    WHEN 'ICICIBANK' THEN 1264.75
    WHEN 'BHARTIARTL' THEN 1678.90
    WHEN 'ITC' THEN 462.80
    WHEN 'KOTAKBANK' THEN 1781.25
    WHEN 'BAJFINANCE' THEN 6734.50
    ELSE 1000.00
  END,
  'manual'
FROM instruments i 
WHERE i.symbol IN ('RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'BAJFINANCE');
