"""
Main orchestrator — runs the entire data pipeline.
This is what GitHub Actions will call in Phase 3.

Usage:
    python scripts/run_all.py
"""

import json
from datetime import datetime
from pathlib import Path

from config import FRONTEND_DATA_DIR

import fetch_exchange_rates
import fetch_world_bank
import fetch_fuel_prices
import generate_insights


def build_dashboard_payload(currency_data, world_bank_data, fuel_data, insights):
    """Assemble everything into a single JSON payload for the frontend."""

    # ---- Build currency series for charts ----
    latest_rates = currency_data.get("rates", {}) if currency_data else {}

    # ---- Build fuel series ----
    fuel_series = {
        "months": [],
        "petrol": [],
        "diesel": [],
        "paraffin": []
    }
    for entry in (fuel_data or []):
        month = datetime.strptime(entry["date"], "%Y-%m-%d").strftime("%b")
        fuel_series["months"].append(month)
        fuel_series["petrol"].append(entry["Petrol 95"])
        fuel_series["diesel"].append(entry["Diesel 50"])
        fuel_series["paraffin"].append(entry["Paraffin"])

    # ---- KPI values ----
    kpis = {
        "usd": latest_rates.get("USD"),
        "zar": latest_rates.get("ZAR"),
        "eur": latest_rates.get("EUR"),
        "gbp": latest_rates.get("GBP"),
        "inflation": world_bank_data.get("FP.CPI.TOTL.ZG", {}).get("value") if world_bank_data else None,
        "gdp": world_bank_data.get("NY.GDP.MKTP.KD.ZG", {}).get("value") if world_bank_data else None,
        "population": world_bank_data.get("SP.POP.TOTL", {}).get("value") if world_bank_data else None,
        "unemployment": world_bank_data.get("SL.UEM.TOTL.ZS", {}).get("value") if world_bank_data else None,
    }

    payload = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "generated_at_local": datetime.utcnow().strftime("%Y-%m-%d %H:%M CAT"),
        "country": "Botswana",
        "currency_base": "BWP",
        "kpis": kpis,
        "exchange_rates": latest_rates,
        "world_bank": world_bank_data or {},
        "fuel_prices": fuel_series,
        "insights": insights,
    }
    return payload


def save_to_frontend(payload):
    """Write the JSON payload to the frontend data folder."""
    out_path = FRONTEND_DATA_DIR / "dashboard.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"\n💾 Saved dashboard.json → {out_path}")
    print(f"   Size: {out_path.stat().st_size:,} bytes")


def main():
    start = datetime.utcnow()
    print("\n" + "🇧🇼 " * 15)
    print("     BOTSWANA ECONOMIC PULSE — DATA PIPELINE")
    print("🇧🇼 " * 15 + "\n")

    # ---- Fetch ----
    currency_data = fetch_exchange_rates.run()
    world_bank_data = fetch_world_bank.run()
    fuel_data = fetch_fuel_prices.run()

    # ---- Insights ----
    insights = generate_insights.run(currency_data, world_bank_data, fuel_data)

    # ---- Assemble ----
    print("\n" + "=" * 50)
    print("📦 BUILDING DASHBOARD PAYLOAD")
    print("=" * 50)
    payload = build_dashboard_payload(currency_data, world_bank_data, fuel_data, insights)
    save_to_frontend(payload)

    # ---- Done ----
    elapsed = (datetime.utcnow() - start).total_seconds()
    print(f"\n✅ PIPELINE COMPLETE — {elapsed:.1f}s\n")


if __name__ == "__main__":
    main()
