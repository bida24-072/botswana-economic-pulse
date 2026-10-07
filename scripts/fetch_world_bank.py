"""
Fetch Botswana economic indicators from the World Bank.
Free API, no key required.
"""

import requests
from datetime import datetime
from config import WORLD_BANK_URL, COUNTRY_CODE, WORLD_BANK_INDICATORS


def fetch_indicator(indicator_code, indicator_name):
    """Fetch latest values for one indicator."""
    url = WORLD_BANK_URL.format(country=COUNTRY_CODE, indicator=indicator_code)
    print(f"🌍 Fetching {indicator_name}...")

    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"  ❌ Failed: {e}")
        return None

    # World Bank returns [meta, [data points]]
    if not isinstance(data, list) or len(data) < 2:
        print(f"  ⚠️  Unexpected format")
        return None

    entries = data[1]
    # Sort by year descending, take first non-null
    for entry in entries:
        value = entry.get("value")
        if value is not None:
            year = entry.get("date")
            print(f"  ✅ {indicator_name} ({year}): {value:,.2f}" if isinstance(value, float) else f"  ✅ {indicator_name} ({year}): {value:,}")
            return {
                "indicator_code": indicator_code,
                "indicator_name": indicator_name,
                "year": year,
                "value": value,
            }
    print(f"  ⚠️  No values found")
    return None


def run():
    print("=" * 50)
    print("🌍 FETCHING WORLD BANK INDICATORS")
    print("=" * 50)

    results = {}
    for code, name in WORLD_BANK_INDICATORS.items():
        data = fetch_indicator(code, name)
        if data:
            results[code] = data
    return results


if __name__ == "__main__":
    run()
