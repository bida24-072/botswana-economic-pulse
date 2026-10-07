"""
Fetch live exchange rates for the Botswana Pula (BWP).
Uses https://open.er-api.com — free, no API key required.
"""

import requests
from datetime import datetime
from config import EXCHANGE_API_URL, BASE_CURRENCY, TRACKED_CURRENCIES
import db


def fetch_rates():
    """Fetch latest BWP exchange rates."""
    url = EXCHANGE_API_URL.format(base=BASE_CURRENCY)
    print(f"🌍 Fetching exchange rates from {url}")

    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"❌ Failed to fetch: {e}")
        return None

    if data.get("result") != "success":
        print(f"❌ API returned error: {data.get('error-type', 'unknown')}")
        return None

    rates = data.get("rates", {})
    timestamp = data.get("time_last_update_utc", "")
    date = datetime.utcnow().strftime("%Y-%m-%d")

    result = {
        "date": date,
        "base": BASE_CURRENCY,
        "timestamp": timestamp,
        "rates": {}
    }

    for currency in TRACKED_CURRENCIES:
        rate = rates.get(currency)
        if rate is not None:
            result["rates"][currency] = rate
            print(f"  ✅ {BASE_CURRENCY}/{currency}: {rate:.4f}")
            db.save_exchange_rate(date, BASE_CURRENCY, currency, rate)

    return result


def run():
    print("=" * 50)
    print("💱 FETCHING EXCHANGE RATES")
    print("=" * 50)
    db.init_schema()
    return fetch_rates()


if __name__ == "__main__":
    run()
