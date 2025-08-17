import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { 
  authMiddleware, 
  getOAuthRedirectUrl, 
  exchangeCodeForSessionToken,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME
} from "@getmocha/users-service/backend";
import { zValidator } from "@hono/zod-validator";
import { CreateTransactionSchema } from "@/shared/types";
import { processZerodhaStatement, processGenericStatement } from "./statement-processor";

// Helper function to update holdings after transaction
async function updateHoldings(db: any, userId: string, accountId: number | null, instrumentId: number) {
  // Calculate total position for this user/account/instrument
  const positionResult = await db.prepare(`
    SELECT 
      SUM(CASE WHEN side = 'BUY' THEN qty ELSE -qty END) as total_qty,
      SUM(CASE WHEN side = 'BUY' THEN qty * price + fees ELSE -(qty * price - fees) END) as total_cost
    FROM transactions 
    WHERE user_id = ? AND instrument_id = ? AND (account_id = ? OR (account_id IS NULL AND ? IS NULL))
  `).bind(userId, instrumentId, accountId, accountId).first();

  const totalQty = positionResult?.total_qty || 0;
  const totalCost = positionResult?.total_cost || 0;
  const avgCost = totalQty > 0 ? totalCost / totalQty : 0;

  // Get current price
  const priceResult = await db.prepare(`
    SELECT close as current_price
    FROM prices_eod 
    WHERE instrument_id = ? 
    ORDER BY date DESC 
    LIMIT 1
  `).bind(instrumentId).first();

  const currentPrice = priceResult?.current_price || 0;
  const marketValue = totalQty * currentPrice;

  if (totalQty > 0) {
    // Insert or update holding
    await db.prepare(`
      INSERT INTO holdings (user_id, account_id, instrument_id, qty, avg_cost, mv_local, last_price, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, instrument_id, COALESCE(account_id, 0)) 
      DO UPDATE SET 
        qty = excluded.qty,
        avg_cost = excluded.avg_cost,
        mv_local = excluded.mv_local,
        last_price = excluded.last_price,
        updated_at = CURRENT_TIMESTAMP
    `).bind(userId, accountId, instrumentId, totalQty, avgCost, marketValue, currentPrice).run();
  } else {
    // Remove holding if quantity is 0
    await db.prepare(`
      DELETE FROM holdings 
      WHERE user_id = ? AND instrument_id = ? AND (account_id = ? OR (account_id IS NULL AND ? IS NULL))
    `).bind(userId, instrumentId, accountId, accountId).run();
  }
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }
  
  // Check if user profile exists in our database
  const existingProfile = await c.env.DB.prepare(
    "SELECT * FROM users WHERE id = ?"
  ).bind(user.id).first();

  if (!existingProfile) {
    // Create user profile on first login
    await c.env.DB.prepare(
      "INSERT INTO users (id, email, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
    ).bind(user.id, user.email).run();
  }

  return c.json(user);
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Dashboard data endpoint
app.get("/api/dashboard", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }
  
  // Get holdings with instrument data
  const holdings = await c.env.DB.prepare(`
    SELECT 
      h.*,
      i.symbol,
      i.name,
      i.exchange,
      i.currency as instrument_currency,
      p.close as current_price
    FROM holdings h
    LEFT JOIN instruments i ON h.instrument_id = i.id
    LEFT JOIN prices_eod p ON i.id = p.instrument_id 
      AND p.date = (SELECT MAX(date) FROM prices_eod WHERE instrument_id = i.id)
    WHERE h.user_id = ? AND h.qty > 0
    ORDER BY h.mv_local DESC
  `).bind(user.id).all();

  // Calculate portfolio metrics
  let portfolio_value = 0;
  let total_cost = 0;
  
  const enrichedHoldings = holdings.results.map((holding: any) => {
    const current_value = (holding.current_price || holding.last_price || 0) * holding.qty;
    const cost_basis = (holding.avg_cost || 0) * holding.qty;
    const pl = current_value - cost_basis;
    const pl_percent = cost_basis > 0 ? (pl / cost_basis) * 100 : 0;
    
    portfolio_value += current_value;
    total_cost += cost_basis;
    
    return {
      ...holding,
      current_value,
      cost_basis,
      pl,
      pl_percent,
      current_price: holding.current_price || holding.last_price || 0
    };
  });

  const total_pl = portfolio_value - total_cost;
  const total_pl_percent = total_cost > 0 ? (total_pl / total_cost) * 100 : 0;

  // Get YTD dividends
  const dividendsResult = await c.env.DB.prepare(`
    SELECT COALESCE(SUM(amount), 0) as ytd_dividends
    FROM dividends 
    WHERE user_id = ? AND date >= date('now', 'start of year')
  `).bind(user.id).first();

  return c.json({
    portfolio_value,
    day_change: 0, // TODO: Calculate from yesterday's close
    day_change_percent: 0,
    total_pl,
    total_pl_percent,
    holdings: enrichedHoldings,
    dividends_ytd: dividendsResult?.ytd_dividends || 0
  });
});

// Transactions endpoints
app.get("/api/transactions", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }
  
  const transactions = await c.env.DB.prepare(`
    SELECT 
      t.*,
      i.symbol,
      i.name,
      a.display_name as account_name
    FROM transactions t
    LEFT JOIN instruments i ON t.instrument_id = i.id
    LEFT JOIN accounts a ON t.account_id = a.id
    WHERE t.user_id = ?
    ORDER BY t.trade_date DESC, t.created_at DESC
    LIMIT 50
  `).bind(user.id).all();

  return c.json(transactions.results);
});

app.post("/api/transactions", authMiddleware, zValidator("json", CreateTransactionSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    // Use D1 transaction API
    const result = await c.env.DB.batch([
      c.env.DB.prepare(`
        INSERT INTO transactions (
          user_id, account_id, instrument_id, side, qty, price, fees, trade_date, settle_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        user.id,
        data.account_id || null,
        data.instrument_id,
        data.side,
        data.qty,
        data.price,
        data.fees,
        data.trade_date,
        data.settle_date || null
      )
    ]);

    // Update holdings
    await updateHoldings(c.env.DB, user.id, data.account_id || null, data.instrument_id);

    return c.json({ id: result[0].meta.last_row_id }, 201);
  } catch (error) {
    console.error("Transaction error:", error);
    return c.json({ error: "Failed to create transaction" }, 500);
  }
});

// Instruments endpoint
app.get("/api/instruments/search", authMiddleware, async (c) => {
  const query = c.req.query("q");
  
  if (!query || query.length < 2) {
    return c.json([]);
  }

  const instruments = await c.env.DB.prepare(`
    SELECT * FROM instruments 
    WHERE (symbol LIKE ? OR name LIKE ?) AND status = 'active'
    ORDER BY 
      CASE WHEN symbol LIKE ? THEN 1 ELSE 2 END,
      symbol
    LIMIT 20
  `).bind(`%${query}%`, `%${query}%`, `${query}%`).all();

  return c.json(instruments.results);
});

// P&L Analysis endpoint
app.get("/api/pl-analysis", authMiddleware, async (c) => {
  const user = c.get("user");
  const period = c.req.query("period") || "1y";
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  // Calculate date range based on period
  let startDate: string;
  const endDate = new Date().toISOString().split('T')[0];
  
  switch (period) {
    case '1m':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '3m':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '6m':
      startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '3y':
      startDate = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '5y':
      startDate = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    default: // 1y
      startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  // Get current holdings for unrealized P&L
  const holdings = await c.env.DB.prepare(`
    SELECT h.*, i.symbol, p.close as current_price
    FROM holdings h
    LEFT JOIN instruments i ON h.instrument_id = i.id
    LEFT JOIN prices_eod p ON i.id = p.instrument_id 
      AND p.date = (SELECT MAX(date) FROM prices_eod WHERE instrument_id = i.id)
    WHERE h.user_id = ? AND h.qty > 0
  `).bind(user.id).all();

  let unrealized_pl = 0;
  for (const holding of holdings.results as any[]) {
    const current_value = (holding.current_price || holding.last_price || 0) * holding.qty;
    const cost_basis = (holding.avg_cost || 0) * holding.qty;
    unrealized_pl += current_value - cost_basis;
  }

  // Get realized P&L from transactions in period
  const realizedResult = await c.env.DB.prepare(`
    SELECT COALESCE(SUM(
      CASE WHEN side = 'SELL' 
      THEN (qty * price - fees) - (qty * (
        SELECT AVG(t2.price) FROM transactions t2 
        WHERE t2.user_id = ? AND t2.instrument_id = t1.instrument_id 
        AND t2.side = 'BUY' AND t2.trade_date <= t1.trade_date
      ))
      ELSE 0 END
    ), 0) as realized_pl
    FROM transactions t1
    WHERE user_id = ? AND trade_date BETWEEN ? AND ?
  `).bind(user.id, user.id, startDate, endDate).first();

  // Get dividends in period
  const dividendsResult = await c.env.DB.prepare(`
    SELECT COALESCE(SUM(amount), 0) as dividends
    FROM dividends 
    WHERE user_id = ? AND date BETWEEN ? AND ?
  `).bind(user.id, startDate, endDate).first();

  const realized_pl = (realizedResult as any)?.realized_pl || 0;
  const dividends = (dividendsResult as any)?.dividends || 0;
  const total_pl = realized_pl + unrealized_pl + dividends;

  // Generate sample chart data
  const chartData = [];
  const monthCount = period === '1m' ? 30 : period === '3m' ? 90 : period === '6m' ? 180 : 365;
  
  for (let i = monthCount; i >= 0; i -= Math.floor(monthCount / 12)) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    chartData.push({
      date: date.toISOString().split('T')[0],
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      portfolioValue: 100000 + Math.random() * 50000,
      monthlyPL: (Math.random() - 0.5) * 10000
    });
  }

  return c.json({
    summary: {
      period,
      realized_pl,
      unrealized_pl,
      dividends,
      total_pl,
      returns_absolute: total_pl,
      returns_percent: total_pl / 100000 * 100 // Assuming 1L base
    },
    chartData
  });
});

// Statements endpoints
app.get("/api/statements", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }
  
  const statements = await c.env.DB.prepare(`
    SELECT s.*, i.rows_total, i.rows_parsed, i.rows_flagged, i.rows_committed
    FROM statements s
    LEFT JOIN imports i ON s.id = i.statement_id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
    LIMIT 50
  `).bind(user.id).all();

  return c.json(statements.results);
});

// Generate sample CSV for testing
app.get("/api/statements/sample-csv", authMiddleware, async () => {
  const sampleCSV = `Symbol,ISIN,Trade Date,Exchange,Segment,Series,Trade Type,Quantity,Price,Order ID,Trade ID
RELIANCE,INE002A01018,2025-08-15,NSE,EQ,EQ,BUY,10,2850.75,12345,67890
TCS,INE467B01029,2025-08-14,NSE,EQ,EQ,BUY,5,4150.20,12346,67891
HDFCBANK,INE040A01034,2025-08-13,NSE,EQ,EQ,BUY,8,1725.90,12347,67892
INFY,INE009A01021,2025-08-12,NSE,EQ,EQ,SELL,3,1840.50,12348,67893
ITC,INE154A01025,2025-08-11,NSE,EQ,EQ,BUY,20,460.25,12349,67894`;

  return new Response(sampleCSV, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="sample-zerodha-statement.csv"'
    }
  });
});

app.post("/api/statements/upload", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    const filename = file.name;
    const fileSize = file.size;
    
    // Validate file size (max 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      return c.json({ error: "File size too large. Maximum 10MB allowed." }, 400);
    }

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.pdf'];
    const fileExt = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExt)) {
      return c.json({ error: "Unsupported file type. Please upload CSV, Excel, or PDF files." }, 400);
    }

    let fileContent: string;
    
    try {
      if (fileExt === '.pdf') {
        // For now, reject PDF files as we need special handling
        return c.json({ error: "PDF processing not yet implemented. Please use CSV or Excel files." }, 400);
      } else {
        fileContent = await file.text();
      }
    } catch (error) {
      console.error('Failed to read file content:', error);
      return c.json({ error: "Failed to read file content. Please ensure the file is not corrupted." }, 400);
    }
    
    // Basic validation of file content
    if (!fileContent || fileContent.trim().length === 0) {
      return c.json({ error: "File appears to be empty" }, 400);
    }

    // Create statement record
    const statementResult = await c.env.DB.prepare(`
      INSERT INTO statements (user_id, filename, broker_code, status, created_at, updated_at)
      VALUES (?, ?, ?, 'processing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(user.id, filename, 'auto-detect').run();

    const statementId = statementResult.meta.last_row_id;
    
    // Process the statement
    let processedData;
    let brokerCode = 'generic';
    
    try {
      // Auto-detect broker format
      if (fileContent.toLowerCase().includes('zerodha') || filename.toLowerCase().includes('zerodha')) {
        brokerCode = 'zerodha';
        processedData = await processZerodhaStatement(c.env.DB, user.id, fileContent);
      } else {
        processedData = await processGenericStatement(c.env.DB, user.id, fileContent);
      }

      const { transactions, errors } = processedData;
      
      // Process transactions
      let successCount = 0;
      try {
        const importResult = await c.env.DB.prepare(`
          INSERT INTO imports (statement_id, rows_total, rows_parsed, rows_flagged, rows_committed, created_at, updated_at)
          VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(statementId, transactions.length + errors.length, transactions.length, errors.length).run();

        // Prepare all transaction inserts for batch processing
        const batchQueries = [];
        for (const transaction of transactions) {
          batchQueries.push(
            c.env.DB.prepare(`
              INSERT INTO transactions (
                user_id, account_id, instrument_id, side, qty, price, fees, trade_date, settle_date, source, import_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              user.id,
              null, // account_id
              transaction.instrument_id,
              transaction.side,
              transaction.qty,
              transaction.price,
              transaction.fees,
              transaction.trade_date,
              null, // settle_date
              transaction.source,
              importResult.meta.last_row_id
            )
          );
        }

        // Execute all inserts in a batch
        try {
          const batchResults = await c.env.DB.batch(batchQueries);
          successCount = batchResults.filter(result => result.success).length;
          
          // Update holdings for affected instruments
          const uniqueInstruments = [...new Set(transactions.map(t => t.instrument_id))];
          for (const instrumentId of uniqueInstruments) {
            await updateHoldings(c.env.DB, user.id, null, instrumentId);
          }
        } catch (error) {
          console.error('Batch insert failed:', error);
          errors.push(`Batch insert failed: ${(error as Error).message}`);
        }

        // Update import record with final counts
        await c.env.DB.prepare(`
          UPDATE imports SET rows_committed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(successCount, importResult.meta.last_row_id).run();

        // Update statement status
        const finalStatus = errors.length > 0 ? 'completed_with_errors' : 'completed';
        const errorSummary = errors.length > 0 ? `${errors.length} errors occurred during processing` : null;
        
        await c.env.DB.prepare(`
          UPDATE statements SET 
            status = ?, 
            broker_code = ?, 
            error_summary = ?, 
            updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).bind(finalStatus, brokerCode, errorSummary, statementId).run();

        return c.json({ 
          success: true,
          id: statementId, 
          processed: successCount,
          total: transactions.length,
          errors: errors.length,
          message: successCount > 0 ? `Successfully processed ${successCount} transactions` : "No valid transactions found in the file"
        }, 201);
        
      } catch (error: any) {
        // Update statement with error status
        await c.env.DB.prepare(`
          UPDATE statements SET 
            status = 'failed', 
            error_summary = ?, 
            updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).bind(`Processing failed: ${error.message}`, statementId).run();
        
        return c.json({ error: `Failed to process statement: ${error.message}` }, 500);
      }
    } catch (error: any) {
      // Update statement with error status
      await c.env.DB.prepare(`
        UPDATE statements SET 
          status = 'failed', 
          error_summary = ?, 
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).bind(`File parsing failed: ${error.message}`, statementId).run();
      
      return c.json({ error: `Failed to parse file: ${error.message}` }, 500);
    }
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return c.json({ error: `Upload failed: ${error.message}` }, 500);
  }
});

// Delete statement endpoint
app.delete("/api/statements/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const statementId = c.req.param("id");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    // Check if statement belongs to user
    const statement = await c.env.DB.prepare(`
      SELECT id FROM statements WHERE id = ? AND user_id = ?
    `).bind(statementId, user.id).first();

    if (!statement) {
      return c.json({ error: "Statement not found" }, 404);
    }

    // Use batch operations for deletion
    try {
      // Get affected instruments before deletion for holdings recalculation
      const affectedInstruments = await c.env.DB.prepare(`
        SELECT DISTINCT t.instrument_id FROM transactions t
        JOIN imports i ON t.import_id = i.id
        WHERE i.statement_id = ?
      `).bind(statementId).all();

      // Execute deletions in batch
      await c.env.DB.batch([
        c.env.DB.prepare(`
          DELETE FROM transactions WHERE import_id IN (
            SELECT id FROM imports WHERE statement_id = ?
          )
        `).bind(statementId),
        c.env.DB.prepare(`
          DELETE FROM imports WHERE statement_id = ?
        `).bind(statementId),
        c.env.DB.prepare(`
          DELETE FROM statements WHERE id = ?
        `).bind(statementId)
      ]);

      // Recalculate holdings for affected instruments
      for (const instrument of affectedInstruments.results as any[]) {
        await updateHoldings(c.env.DB, user.id, null, instrument.instrument_id);
      }

      return c.json({ success: true, message: "Statement deleted successfully" });
      
    } catch (error: any) {
      throw error;
    }
    
  } catch (error: any) {
    console.error('Delete error:', error);
    return c.json({ error: `Failed to delete statement: ${error.message}` }, 500);
  }
});

// Broker connection endpoints
app.get("/api/brokers", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  // Get user's broker connections
  const connections = await c.env.DB.prepare(`
    SELECT broker_code, display_name, external_account_id, created_at
    FROM accounts 
    WHERE user_id = ? AND broker_code IS NOT NULL
  `).bind(user.id).all();

  const supportedBrokers = [
    { code: 'zerodha', name: 'Zerodha', logo: '🟢', status: 'available' },
    { code: 'upstox', name: 'Upstox', logo: '🟡', status: 'available' },
    { code: 'icici_direct', name: 'ICICI Direct', logo: '🔵', status: 'available' },
    { code: 'hdfc_securities', name: 'HDFC Securities', logo: '🔴', status: 'available' },
    { code: 'angel_one', name: 'Angel One', logo: '⚫', status: 'available' },
    { code: 'groww', name: 'Groww', logo: '🟠', status: 'available' }
  ];

  const enrichedBrokers = supportedBrokers.map(broker => {
    const connection = connections.results.find((c: any) => c.broker_code === broker.code);
    return {
      ...broker,
      connected: !!connection,
      connection_date: connection?.created_at || null,
      account_name: connection?.display_name || null
    };
  });

  return c.json(enrichedBrokers);
});

app.post("/api/brokers/:brokerCode/connect", authMiddleware, async (c) => {
  const user = c.get("user");
  const brokerCode = c.req.param("brokerCode");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  // For demo purposes, simulate OAuth flow
  // In production, this would redirect to broker's OAuth URL
  const mockAuthUrl = `https://api.${brokerCode}.com/oauth/authorize?client_id=demo&redirect_uri=${encodeURIComponent(`${c.req.url}/callback`)}`;
  
  return c.json({ 
    auth_url: mockAuthUrl,
    state: `${user.id}_${brokerCode}_${Date.now()}`
  });
});

app.post("/api/brokers/:brokerCode/callback", authMiddleware, async (c) => {
  const user = c.get("user");
  const brokerCode = c.req.param("brokerCode");
  const body = await c.req.json();
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  // Simulate successful OAuth callback
  if (body.code) {
    // Create broker account connection
    await c.env.DB.prepare(`
      INSERT INTO accounts (user_id, broker_code, display_name, external_account_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      brokerCode,
      `${brokerCode.charAt(0).toUpperCase() + brokerCode.slice(1)} Account`,
      `ext_${Date.now()}`
    ).run();

    return c.json({ success: true, message: "Broker connected successfully" });
  }

  return c.json({ error: "Invalid authorization code" }, 400);
});

app.delete("/api/brokers/:brokerCode/disconnect", authMiddleware, async (c) => {
  const user = c.get("user");
  const brokerCode = c.req.param("brokerCode");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  // Remove broker connection
  await c.env.DB.prepare(`
    DELETE FROM accounts WHERE user_id = ? AND broker_code = ?
  `).bind(user.id, brokerCode).run();

  return c.json({ success: true, message: "Broker disconnected successfully" });
});

// Auto-sync endpoint for connected brokers
app.post("/api/brokers/sync", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  // Get connected broker accounts
  const accounts = await c.env.DB.prepare(`
    SELECT * FROM accounts WHERE user_id = ? AND broker_code IS NOT NULL
  `).bind(user.id).all();

  const syncResults = [];
  
  for (const account of accounts.results as any[]) {
    // Simulate fetching data from broker API
    try {
      // In production, this would call the actual broker API
      const mockTransactions = [
        {
          symbol: 'RELIANCE',
          side: 'BUY',
          qty: 10,
          price: 2500,
          fees: 25,
          trade_date: new Date().toISOString().split('T')[0]
        }
      ];

      let importedCount = 0;
      for (const txn of mockTransactions) {
        // Find or create instrument
        let instrument = await c.env.DB.prepare(`
          SELECT id FROM instruments WHERE symbol = ?
        `).bind(txn.symbol).first();
        
        if (!instrument) {
          const result = await c.env.DB.prepare(`
            INSERT INTO instruments (symbol, exchange, name, currency, status)
            VALUES (?, 'NSE', ?, 'INR', 'active')
          `).bind(txn.symbol, txn.symbol).run();
          instrument = { id: result.meta.last_row_id };
        }

        // Insert transaction
        await c.env.DB.prepare(`
          INSERT INTO transactions (
            user_id, account_id, instrument_id, side, qty, price, fees, trade_date, source
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          user.id,
          account.id,
          instrument.id,
          txn.side,
          txn.qty,
          txn.price,
          txn.fees,
          txn.trade_date,
          `${account.broker_code}_sync`
        ).run();

        await updateHoldings(c.env.DB, user.id, account.id as number, instrument.id as number);
        importedCount++;
      }

      syncResults.push({
        broker: account.broker_code,
        account: account.display_name,
        imported: importedCount,
        status: 'success'
      });
      
    } catch (error) {
      syncResults.push({
        broker: account.broker_code,
        account: account.display_name,
        imported: 0,
        status: 'error',
        error: (error as Error).message
      });
    }
  }

  return c.json({ 
    synced_accounts: syncResults.length,
    results: syncResults
  });
});

// Admin endpoints
app.get("/api/admin/stats", authMiddleware, async (c) => {
  const user = c.get("user");
  
  // In a real app, check if user is admin
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const userStats = await c.env.DB.prepare(`
    SELECT COUNT(*) as total_users FROM users
  `).first();

  const transactionStats = await c.env.DB.prepare(`
    SELECT COUNT(*) as total_transactions FROM transactions
  `).first();

  const uploadStats = await c.env.DB.prepare(`
    SELECT 
      COUNT(*) as total_uploads,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_uploads,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_uploads
    FROM statements
  `).first();

  return c.json({
    total_users: (userStats as any)?.total_users || 0,
    free_users: (userStats as any)?.total_users || 0, // Mock data
    plus_users: 0,
    pro_users: 0,
    total_transactions: (transactionStats as any)?.total_transactions || 0,
    total_uploads: (uploadStats as any)?.total_uploads || 0,
    pending_uploads: (uploadStats as any)?.pending_uploads || 0,
    failed_uploads: (uploadStats as any)?.failed_uploads || 0,
    active_connections: 0
  });
});

app.get("/api/admin/users", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  const users = await c.env.DB.prepare(`
    SELECT 
      u.*,
      'free' as account_type,
      u.created_at as last_active,
      COUNT(t.id) as total_transactions
    FROM users u
    LEFT JOIN transactions t ON u.id = t.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT 50
  `).all();

  return c.json(users.results);
});

export default app;
