"""
Database connection and helpers.
Works with both SQLite (local) and PostgreSQL (Supabase).
"""

import json
from datetime import datetime
from sqlalchemy import create_engine, text
from config import DATABASE_URL

engine = create_engine(DATABASE_URL, echo=False)


def get_engine():
    return engine


def init_schema():
    """Create tables if they don't exist."""
    schema = """
    CREATE TABLE IF NOT EXISTS exchange_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        base_currency TEXT NOT NULL,
        quote_currency TEXT NOT NULL,
        rate REAL NOT NULL,
        created_at TEXT NOT NULL
    );
    """
    # Note: 'AUTOINCREMENT' works in SQLite. For Postgres, replace with SERIAL.
    # For portability, we'll keep it simple and let SQLAlchemy handle it.

    with engine.connect() as conn:
        try:
            conn.execute(text(schema))
            conn.commit()
        except Exception as e:
            # Postgres syntax fallback
            pg_schema = schema.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "SERIAL PRIMARY KEY")
            conn.execute(text(pg_schema))
            conn.commit()


def save_exchange_rate(date, base, quote, rate):
    """Insert one exchange rate row."""
    now = datetime.utcnow().isoformat()
    with engine.connect() as conn:
        try:
            conn.execute(text("""
                INSERT INTO exchange_rates (date, base_currency, quote_currency, rate, created_at)
                VALUES (:date, :base, :quote, :rate, :created)
            """), {"date": date, "base": base, "quote": quote, "rate": rate, "created": now})
            conn.commit()
        except Exception as e:
            print(f"  ⚠️  DB write failed: {e}")


def latest_exchange_rates():
    """Return the most recent rate per currency pair."""
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT quote_currency, rate, date
            FROM exchange_rates
            WHERE date = (SELECT MAX(date) FROM exchange_rates)
        """))
        return [dict(row._mapping) for row in result]


def get_conn():
    return engine.connect()
