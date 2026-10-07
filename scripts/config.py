"""
Central configuration for Botswana Economic Pulse.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# ==========================================
# PATHS
# ==========================================
ROOT_DIR = Path(__file__).parent.parent
DATA_DIR = ROOT_DIR / "data"
FRONTEND_DATA_DIR = ROOT_DIR / "frontend" / "data"
DATABASE_DIR = ROOT_DIR / "database"

# Ensure folders exist
DATA_DIR.mkdir(exist_ok=True)
FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

# ==========================================
# DATABASE
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR}/pulse.db")

# ==========================================
# COUNTRY
# ==========================================
COUNTRY_CODE = "BW"
COUNTRY_NAME = "Botswana"

# ==========================================
# CURRENCIES
# ==========================================
BASE_CURRENCY = "BWP"
TRACKED_CURRENCIES = ["USD", "ZAR", "EUR", "GBP"]

# ==========================================
# WORLD BANK INDICATORS
# ==========================================
WORLD_BANK_INDICATORS = {
    "NY.GDP.MKTP.KD.ZG": "GDP Growth",
    "FP.CPI.TOTL.ZG": "Inflation Rate",
    "SP.POP.TOTL": "Population",
    "SL.UEM.TOTL.ZS": "Unemployment",
}

# ==========================================
# FUEL
# ==========================================
FUEL_TYPES = ["Petrol 95", "Diesel 50", "Paraffin"]

# ==========================================
# API ENDPOINTS (all free, no key required)
# ==========================================
EXCHANGE_API_URL = "https://open.er-api.com/v6/latest/{base}"
WORLD_BANK_URL = "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}?format=json&per_page=100"
