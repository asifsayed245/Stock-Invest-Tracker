// Helper function to parse CSV content
function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.split('\n');
  const result: string[][] = [];
  
  for (const line of lines) {
    if (line.trim()) {
      // Simple CSV parsing - handles quotes and commas
      const fields: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim());
      result.push(fields);
    }
  }
  
  return result;
}

// Helper function to process Zerodha statement format
export async function processZerodhaStatement(db: any, _userId: string, csvContent: string): Promise<{transactions: any[], errors: string[]}> {
  const rows = parseCSV(csvContent);
  const transactions: any[] = [];
  const errors: string[] = [];
  
  if (rows.length === 0) {
    errors.push("File appears to be empty");
    return { transactions, errors };
  }
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip empty rows
    if (!row || row.every(cell => !cell || cell.trim() === '')) {
      continue;
    }
    
    try {
      // Zerodha format: Symbol, ISIN, Trade Date, Exchange, Segment, Series, Trade Type, Quantity, Price, Order ID, Trade ID
      if (row.length >= 9) {
        const symbol = row[0]?.replace(/\s+/g, '').toUpperCase();
        const tradeDate = row[2];
        const exchange = row[3] || 'NSE';
        const tradeType = row[6]?.toUpperCase(); // BUY/SELL
        const quantity = parseFloat(row[7]);
        const price = parseFloat(row[8]);
        
        // Validate required fields
        if (!symbol) {
          errors.push(`Row ${i + 1}: Missing symbol`);
          continue;
        }
        
        if (!tradeDate) {
          errors.push(`Row ${i + 1}: Missing trade date`);
          continue;
        }
        
        if (!tradeType || (tradeType !== 'BUY' && tradeType !== 'SELL')) {
          errors.push(`Row ${i + 1}: Invalid trade type '${tradeType}'. Must be BUY or SELL`);
          continue;
        }
        
        if (isNaN(quantity) || quantity <= 0) {
          errors.push(`Row ${i + 1}: Invalid quantity '${row[7]}'`);
          continue;
        }
        
        if (isNaN(price) || price <= 0) {
          errors.push(`Row ${i + 1}: Invalid price '${row[8]}'`);
          continue;
        }
        
        // Validate and format date
        let formattedDate = tradeDate;
        try {
          const date = new Date(tradeDate);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
          }
          formattedDate = date.toISOString().split('T')[0];
        } catch {
          errors.push(`Row ${i + 1}: Invalid date format '${tradeDate}'`);
          continue;
        }
        
        // Find or create instrument
        let instrument = await db.prepare(`
          SELECT id FROM instruments WHERE symbol = ? AND exchange = ?
        `).bind(symbol, exchange).first();
        
        if (!instrument) {
          const instrumentResult = await db.prepare(`
            INSERT INTO instruments (symbol, exchange, name, currency, status, created_at, updated_at)
            VALUES (?, ?, ?, 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `).bind(symbol, exchange, symbol).run();
          
          instrument = { id: instrumentResult.meta.last_row_id };
        }
        
        transactions.push({
          instrument_id: instrument.id,
          side: tradeType,
          qty: quantity,
          price: price,
          fees: 0, // Calculate fees if available in statement
          trade_date: formattedDate,
          source: 'zerodha_import'
        });
      } else {
        errors.push(`Row ${i + 1}: Insufficient columns (expected 9+, got ${row.length})`);
      }
    } catch (error: any) {
      errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }
  
  return { transactions, errors };
}

// Helper function to process generic statement format
export async function processGenericStatement(db: any, _userId: string, csvContent: string): Promise<{transactions: any[], errors: string[]}> {
  const rows = parseCSV(csvContent);
  const transactions: any[] = [];
  const errors: string[] = [];
  
  if (rows.length === 0) {
    errors.push("File appears to be empty");
    return { transactions, errors };
  }
  
  // Try to auto-detect column mapping
  const headers = rows[0]?.map(h => h.toLowerCase().trim()) || [];
  
  const columnMapping = {
    symbol: headers.findIndex(h => h.includes('symbol') || h.includes('script') || h.includes('stock') || h.includes('instrument')),
    date: headers.findIndex(h => h.includes('date') || h.includes('time')),
    side: headers.findIndex(h => h.includes('buy') || h.includes('sell') || h.includes('action') || h.includes('type') || h.includes('trade')),
    quantity: headers.findIndex(h => h.includes('qty') || h.includes('quantity') || h.includes('shares') || h.includes('units')),
    price: headers.findIndex(h => h.includes('price') || h.includes('rate') || h.includes('value') || h.includes('amount'))
  };
  
  // Process rows if we can detect basic columns
  if (columnMapping.symbol >= 0 && columnMapping.date >= 0 && columnMapping.side >= 0 && 
      columnMapping.quantity >= 0 && columnMapping.price >= 0) {
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows
      if (!row || row.every(cell => !cell || cell.trim() === '')) {
        continue;
      }
      
      try {
        const symbol = row[columnMapping.symbol]?.replace(/\s+/g, '').toUpperCase();
        const tradeDate = row[columnMapping.date];
        const side = row[columnMapping.side]?.toUpperCase();
        const quantity = parseFloat(row[columnMapping.quantity]);
        const price = parseFloat(row[columnMapping.price]);
        
        // Validate required fields
        if (!symbol) {
          errors.push(`Row ${i + 1}: Missing symbol`);
          continue;
        }
        
        if (!tradeDate) {
          errors.push(`Row ${i + 1}: Missing trade date`);
          continue;
        }
        
        if (!side || (!side.includes('BUY') && !side.includes('SELL'))) {
          errors.push(`Row ${i + 1}: Invalid trade type '${side}'. Must contain BUY or SELL`);
          continue;
        }
        
        if (isNaN(quantity) || quantity <= 0) {
          errors.push(`Row ${i + 1}: Invalid quantity '${row[columnMapping.quantity]}'`);
          continue;
        }
        
        if (isNaN(price) || price <= 0) {
          errors.push(`Row ${i + 1}: Invalid price '${row[columnMapping.price]}'`);
          continue;
        }
        
        // Validate and format date
        let formattedDate = tradeDate;
        try {
          const date = new Date(tradeDate);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
          }
          formattedDate = date.toISOString().split('T')[0];
        } catch {
          errors.push(`Row ${i + 1}: Invalid date format '${tradeDate}'`);
          continue;
        }
        
        // Find or create instrument
        let instrument = await db.prepare(`
          SELECT id FROM instruments WHERE symbol = ?
        `).bind(symbol).first();
        
        if (!instrument) {
          const instrumentResult = await db.prepare(`
            INSERT INTO instruments (symbol, exchange, name, currency, status, created_at, updated_at)
            VALUES (?, 'NSE', ?, 'INR', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `).bind(symbol, symbol).run();
          
          instrument = { id: instrumentResult.meta.last_row_id };
        }
        
        transactions.push({
          instrument_id: instrument.id,
          side: side.includes('BUY') ? 'BUY' : 'SELL',
          qty: quantity,
          price: price,
          fees: 0,
          trade_date: formattedDate,
          source: 'generic_import'
        });
      } catch (error: any) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }
  } else {
    errors.push(`Could not detect required columns. Found headers: ${headers.join(', ')}. Expected: Symbol, Date, Action, Quantity, Price`);
  }
  
  return { transactions, errors };
}
