import os
from dotenv import load_dotenv

load_dotenv()

OSRM_BASE_URL = os.getenv("OSRM_BASE_URL", "http://localhost:5000")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")