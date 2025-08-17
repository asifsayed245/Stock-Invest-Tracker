import z from "zod";

// User profile schema
export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  base_currency: z.string().default('USD'),
  timezone: z.string().default('UTC'),
  created_at: z.string(),
  updated_at: z.string()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Account schema
export const AccountSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  broker_code: z.string().nullable(),
  display_name: z.string(),
  currency: z.string().default('USD'),
  external_account_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string()
});

export type Account = z.infer<typeof AccountSchema>;

// Instrument schema
export const InstrumentSchema = z.object({
  id: z.number(),
  symbol: z.string(),
  exchange: z.string().nullable(),
  name: z.string().nullable(),
  currency: z.string().default('USD'),
  isin: z.string().nullable(),
  status: z.string().default('active'),
  created_at: z.string(),
  updated_at: z.string()
});

export type Instrument = z.infer<typeof InstrumentSchema>;

// Transaction schema
export const TransactionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  account_id: z.number().nullable(),
  instrument_id: z.number(),
  side: z.enum(['BUY', 'SELL']),
  qty: z.number(),
  price: z.number(),
  fees: z.number().default(0),
  trade_date: z.string(),
  settle_date: z.string().nullable(),
  source: z.string().default('manual'),
  import_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string()
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Holdings schema
export const HoldingSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  account_id: z.number().nullable(),
  instrument_id: z.number(),
  qty: z.number(),
  avg_cost: z.number().nullable(),
  mv_local: z.number().nullable(),
  last_price: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string()
});

export type Holding = z.infer<typeof HoldingSchema>;

// Dividend schema
export const DividendSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  instrument_id: z.number(),
  date: z.string(),
  amount: z.number(),
  currency: z.string().default('USD'),
  created_at: z.string(),
  updated_at: z.string()
});

export type Dividend = z.infer<typeof DividendSchema>;

// API request/response schemas
export const CreateTransactionSchema = z.object({
  account_id: z.number().optional(),
  instrument_id: z.number(),
  side: z.enum(['BUY', 'SELL']),
  qty: z.number().positive(),
  price: z.number().positive(),
  fees: z.number().default(0),
  trade_date: z.string(),
  settle_date: z.string().optional()
});

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;

// Dashboard data schema
export const DashboardDataSchema = z.object({
  portfolio_value: z.number(),
  day_change: z.number(),
  day_change_percent: z.number(),
  total_pl: z.number(),
  total_pl_percent: z.number(),
  holdings: z.array(HoldingSchema.extend({
    instrument: InstrumentSchema,
    pl: z.number(),
    pl_percent: z.number()
  })),
  dividends_ytd: z.number()
});

export type DashboardData = z.infer<typeof DashboardDataSchema>;
