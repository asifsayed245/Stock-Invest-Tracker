
-- Insert sample instruments for testing
INSERT INTO instruments (symbol, exchange, name, currency, status) VALUES
('AAPL', 'NASDAQ', 'Apple Inc.', 'USD', 'active'),
('GOOGL', 'NASDAQ', 'Alphabet Inc. Class A', 'USD', 'active'),
('MSFT', 'NASDAQ', 'Microsoft Corporation', 'USD', 'active'),
('AMZN', 'NASDAQ', 'Amazon.com Inc.', 'USD', 'active'),
('TSLA', 'NASDAQ', 'Tesla Inc.', 'USD', 'active'),
('META', 'NASDAQ', 'Meta Platforms Inc.', 'USD', 'active'),
('NVDA', 'NASDAQ', 'NVIDIA Corporation', 'USD', 'active'),
('NFLX', 'NASDAQ', 'Netflix Inc.', 'USD', 'active'),
('AMD', 'NASDAQ', 'Advanced Micro Devices Inc.', 'USD', 'active'),
('INTC', 'NASDAQ', 'Intel Corporation', 'USD', 'active'),
('CRM', 'NYSE', 'Salesforce Inc.', 'USD', 'active'),
('ORCL', 'NYSE', 'Oracle Corporation', 'USD', 'active'),
('IBM', 'NYSE', 'International Business Machines Corporation', 'USD', 'active'),
('ADBE', 'NASDAQ', 'Adobe Inc.', 'USD', 'active'),
('PYPL', 'NASDAQ', 'PayPal Holdings Inc.', 'USD', 'active');

-- Insert sample prices for current market values
INSERT INTO prices_eod (instrument_id, date, close, adjusted_close, source) VALUES
(1, '2024-08-16', 224.72, 224.72, 'sample'), -- AAPL
(2, '2024-08-16', 158.44, 158.44, 'sample'), -- GOOGL
(3, '2024-08-16', 415.26, 415.26, 'sample'), -- MSFT
(4, '2024-08-16', 174.70, 174.70, 'sample'), -- AMZN
(5, '2024-08-16', 240.83, 240.83, 'sample'), -- TSLA
(6, '2024-08-16', 527.34, 527.34, 'sample'), -- META
(7, '2024-08-16', 125.61, 125.61, 'sample'), -- NVDA
(8, '2024-08-16', 645.75, 645.75, 'sample'), -- NFLX
(9, '2024-08-16', 144.19, 144.19, 'sample'), -- AMD
(10, '2024-08-16', 21.84, 21.84, 'sample'), -- INTC
(11, '2024-08-16', 268.85, 268.85, 'sample'), -- CRM
(12, '2024-08-16', 138.73, 138.73, 'sample'), -- ORCL
(13, '2024-08-16', 196.35, 196.35, 'sample'), -- IBM
(14, '2024-08-16', 559.89, 559.89, 'sample'), -- ADBE
(15, '2024-08-16', 64.11, 64.11, 'sample'); -- PYPL
