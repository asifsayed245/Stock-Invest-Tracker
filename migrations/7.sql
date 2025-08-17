
-- Insert sample instruments for Indian stocks
INSERT OR IGNORE INTO instruments (symbol, exchange, name, currency, status, created_at, updated_at) VALUES 
('RELIANCE', 'NSE', 'Reliance Industries Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('TCS', 'NSE', 'Tata Consultancy Services Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HDFCBANK', 'NSE', 'HDFC Bank Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('INFY', 'NSE', 'Infosys Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ITC', 'NSE', 'ITC Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HINDUNILVR', 'NSE', 'Hindustan Unilever Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ICICIBANK', 'NSE', 'ICICI Bank Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SBIN', 'NSE', 'State Bank of India', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BHARTIARTL', 'NSE', 'Bharti Airtel Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('KOTAKBANK', 'NSE', 'Kotak Mahindra Bank Limited', 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample prices for current valuations
INSERT OR IGNORE INTO prices_eod (instrument_id, date, close, adjusted_close, source, created_at, updated_at) 
SELECT 
  i.id,
  date('now') as date,
  CASE i.symbol
    WHEN 'RELIANCE' THEN 2850.75
    WHEN 'TCS' THEN 4150.20
    WHEN 'HDFCBANK' THEN 1725.90
    WHEN 'INFY' THEN 1840.50
    WHEN 'ITC' THEN 460.25
    WHEN 'HINDUNILVR' THEN 2650.30
    WHEN 'ICICIBANK' THEN 1285.40
    WHEN 'SBIN' THEN 825.60
    WHEN 'BHARTIARTL' THEN 1650.75
    WHEN 'KOTAKBANK' THEN 1895.20
    ELSE 1000.00
  END as close,
  CASE i.symbol
    WHEN 'RELIANCE' THEN 2850.75
    WHEN 'TCS' THEN 4150.20
    WHEN 'HDFCBANK' THEN 1725.90
    WHEN 'INFY' THEN 1840.50
    WHEN 'ITC' THEN 460.25
    WHEN 'HINDUNILVR' THEN 2650.30
    WHEN 'ICICIBANK' THEN 1285.40
    WHEN 'SBIN' THEN 825.60
    WHEN 'BHARTIARTL' THEN 1650.75
    WHEN 'KOTAKBANK' THEN 1895.20
    ELSE 1000.00
  END as adjusted_close,
  'initial_data' as source,
  CURRENT_TIMESTAMP as created_at,
  CURRENT_TIMESTAMP as updated_at
FROM instruments i
WHERE i.symbol IN ('RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC', 'HINDUNILVR', 'ICICIBANK', 'SBIN', 'BHARTIARTL', 'KOTAKBANK');
