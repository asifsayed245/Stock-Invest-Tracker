
DELETE FROM prices_eod WHERE source = 'sample';
DELETE FROM instruments WHERE symbol IN ('AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC', 'CRM', 'ORCL', 'IBM', 'ADBE', 'PYPL');
