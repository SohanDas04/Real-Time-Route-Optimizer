import numpy as np
import httpx
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
TOMTOM_KEY = os.getenv("TOMTOM_API_KEY")

TRAFFIC_THRESHOLDS = {"Low": 35, "Medium": 15}

async def fetch_live_speed(lat, lng):
    url = (f"https://api.tomtom.com/traffic/services/4/flowSegmentData/"
           f"relative0/10/json?point={lat},{lng}&key={TOMTOM_KEY}")
    try:
        async with httpx.AsyncClient() as c:
            r = await c.get(url, timeout=5)
            data = r.json()
            frc = data.get("flowSegmentData", {})
            current = frc.get("currentSpeed", 0)
            free_flow = frc.get("freeFlowSpeed", 50)
            return current, free_flow
    except:
        return 25, 50  # fallback

async def score_route(route, timestamp_ms):
    coords = route["geojson"]["coordinates"]
    total_time = 0
    speeds = []

    # Sample every 10th coordinate to avoid too many API calls
    sampled = coords[::max(len(coords)//5, 1)][:5]

    for coord in sampled:
        lng, lat = coord[0], coord[1]
        current_speed, free_flow = await fetch_live_speed(lat, lng)
        if current_speed > 0:
            speeds.append(current_speed)

    avg_speed = np.mean(speeds) if speeds else 25

    # Calculate time using real speed
    legs = route.get("legs", [])
    for leg in legs:
        dist = leg["distance"]  # meters
        total_time += dist / max(avg_speed / 3.6, 1)

    if avg_speed > TRAFFIC_THRESHOLDS["Low"]:
        level = "Low"
    elif avg_speed > TRAFFIC_THRESHOLDS["Medium"]:
        level = "Medium"
    else:
        level = "High"

    route["trafficLevel"] = level
    route["speed"] = round(avg_speed, 1)
    return total_time  # seconds