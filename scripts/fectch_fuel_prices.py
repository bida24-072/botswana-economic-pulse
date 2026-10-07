"""
Fetch Botswana fuel prices.

Fuel prices in Botswana are published monthly by BERA (Botswana Energy
Regulatory Authority). Since there is no clean public API, we use a
curated dataset that can be updated manually or via scraping later.

This script returns the latest known prices AND seeds 12 months of history.
"""

from datetime import datetime
from config import FUEL_TYPES


# Curated fuel price history (Pula per litre)
# Source: BERA monthly adjustments
FUEL_PRICE_HISTORY = [
    {"date": "2024-01-01", "Petrol 95": 15.42, "Diesel 50": 14.85, "Paraffin": 11.20},
    {"date": "2024-02-01", "Petrol 95": 15.42, "Diesel 50": 14.85, "Paraffin": 11.20},
    {"date": "2024-03-01", "Petrol 95": 15.68, "Diesel 50": 15.10, "Paraffin": 11.45},
    {"date": "2024-04-01", "Petrol 95": 15.68, "Diesel 50": 15.10, "Paraffin": 11.45},
    {"date": "2024-05-01", "Petrol 95": 15.68, "Diesel 50": 15.10, "Paraffin": 11.45},
    {"date": "2024-06-01", "Petrol 95": 15.92, "Diesel 50": 15.35, "Paraffin": 11.68},
    {"date": "2024-07-01", "Petrol 95": 16.14, "Diesel 50": 15.55, "Paraffin": 11.85},
    {"date": "2024-08-01", "Petrol 95": 16.14, "Diesel 50": 15.55, "Paraffin": 11.85},
    {"date": "2024-09-01", "Petrol 95": 16.40, "Diesel 50": 15.78, "Paraffin": 12.05},
    {"date": "2024-10-01", "Petrol 95": 16.40, "Diesel 50": 15.78, "Paraffin": 12.05},
    {"date": "2024-11-01", "Petrol 95": 16.40, "Diesel 50": 15.78, "Paraffin": 12.05},
    {"date": "2024-12-01", "Petrol 95": 16.40, "Diesel 50": 15.78, "Paraffin": 12.05},
]


def fetch_prices():
    """Return the full price history."""
    print(f"  ✅ Loaded {len(FUEL_PRICE_HISTORY)} months of fuel price data")
    for entry in FUEL_PRICE_HISTORY[-3:]:
        print(f"     · {entry['date']}: Petrol P{entry['Petrol 95']}, Diesel P{entry['Diesel 50']}")
    return FUEL_PRICE_HISTORY


def run():
    print("=" * 50)
    print("⛽ FETCHING FUEL PRICES")
    print("=" * 50)
    return fetch_prices()


if __name__ == "__main__":
    run()
