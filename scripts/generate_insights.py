"""
Generate plain-English insights from the collected data.
"""

from datetime import datetime


def generate(currency_data, world_bank_data, fuel_data):
    """Produce a list of insight dicts ready for the dashboard."""
    insights = []

    # ---- Currency insights ----
    if currency_data and currency_data.get("rates"):
        rates = currency_data["rates"]
        if "USD" in rates:
            usd = rates["USD"]
            insights.append({
                "type": "info",
                "icon": "fa-dollar-sign",
                "title": f"BWP/USD trading at {usd:.4f}",
                "text": f"The Pula is currently exchanging at {usd:.4f} per US Dollar. This rate reflects the latest published interbank reference."
            })
        if "ZAR" in rates:
            zar = rates["ZAR"]
            insights.append({
                "type": "info",
                "icon": "fa-coins",
                "title": f"BWP/ZAR at {zar:.4f}",
                "text": f"One Pula buys {zar:.4f} South African Rand. Watch this pair closely — the Rand often leads Pula movements."
            })

    # ---- Inflation ----
    inflation = world_bank_data.get("FP.CPI.TOTL.ZG") if world_bank_data else None
    if inflation:
        value = inflation["value"]
        year = inflation["year"]
        insight_type = "positive" if value < 4 else "warning" if value < 6 else "danger"
        insights.append({
            "type": insight_type,
            "icon": "fa-chart-line",
            "title": f"Inflation at {value:.1f}% ({year})",
            "text": f"Botswana's inflation rate stands at {value:.1f}%. Bank of Botswana targets 3–6%. " +
                    ("Comfortably within target." if value <= 6 else "Currently above target.")
        })

    # ---- GDP Growth ----
    gdp = world_bank_data.get("NY.GDP.MKTP.KD.ZG") if world_bank_data else None
    if gdp:
        value = gdp["value"]
        year = gdp["year"]
        insight_type = "positive" if value > 2 else "warning" if value > 0 else "danger"
        insights.append({
            "type": insight_type,
            "icon": "fa-arrow-trend-up",
            "title": f"GDP growth of {value:.1f}% ({year})",
            "text": f"Botswana's economy grew {value:.1f}% year-on-year. " +
                    ("Solid performance." if value > 2 else "Modest growth." if value > 0 else "Contracting.")
        })

    # ---- Unemployment ----
    unemployment = world_bank_data.get("SL.UEM.TOTL.ZS") if world_bank_data else None
    if unemployment:
        value = unemployment["value"]
        year = unemployment["year"]
        insights.append({
            "type": "warning" if value > 15 else "info",
            "icon": "fa-users",
            "title": f"Unemployment at {value:.1f}% ({year})",
            "text": f"Youth unemployment remains a key challenge. This indicator drives much of the policy conversation in Botswana."
        })

    # ---- Fuel ----
    if fuel_data:
        latest = fuel_data[-1]
        previous = fuel_data[-2] if len(fuel_data) > 1 else latest
        change = latest["Petrol 95"] - previous["Petrol 95"]
        trend = "unchanged" if abs(change) < 0.01 else f"up {change:+.2f}"
        insights.append({
            "type": "info",
            "icon": "fa-gas-pump",
            "title": f"Petrol 95 at P{latest['Petrol 95']:.2f}/L",
            "text": f"Petrol prices are {trend} vs last month. Diesel at P{latest['Diesel 50']:.2f}/L and paraffin at P{latest['Paraffin']:.2f}/L."
        })

    # ---- Population (curiosity) ----
    population = world_bank_data.get("SP.POP.TOTL") if world_bank_data else None
    if population:
        value = population["value"]
        insights.append({
            "type": "info",
            "icon": "fa-globe-africa",
            "title": f"Population: {value:,.0f}",
            "text": f"Botswana's population stands at approximately {value:,.0f}. This drives demand, labour, and market size across every sector."
        })

    # ---- Fallback ----
    if not insights:
        insights.append({
            "type": "info",
            "icon": "fa-info-circle",
            "title": "Data loading",
            "text": "Insights will appear once the first data refresh completes."
        })

    return insights


def run(currency_data, world_bank_data, fuel_data):
    print("=" * 50)
    print("🧠 GENERATING INSIGHTS")
    print("=" * 50)
    result = generate(currency_data, world_bank_data, fuel_data)
    print(f"  ✅ Generated {len(result)} insights")
    return result


if __name__ == "__main__":
    # Test with empty data
    run(None, None, None)
