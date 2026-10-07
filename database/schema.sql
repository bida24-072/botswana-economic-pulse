-- ==========================================
-- Botswana Economic Pulse — Database Schema
-- ==========================================

-- Exchange rates snapshot (one row per currency per day)
CREATE TABLE IF NOT EXISTS exchange_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    base_currency TEXT NOT NULL,
    quote_currency TEXT NOT NULL,
    rate REAL NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exchange_date ON exchange_rates(date);
CREATE INDEX IF NOT EXISTS idx_exchange_pair ON exchange_rates(base_currency, quote_currency);

-- World Bank indicators
CREATE TABLE IF NOT EXISTS world_bank_indicators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_code TEXT NOT NULL,
    indicator_code TEXT NOT NULL,
    indicator_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    value REAL NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wb_indicator ON world_bank_indicators(indicator_code);

-- Fuel prices
CREATE TABLE IF NOT EXISTS fuel_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    fuel_type TEXT NOT NULL,
    price_per_litre REAL NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fuel_date ON fuel_prices(date);

-- Daily generated insights
CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL
);
