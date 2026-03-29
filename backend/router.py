import httpx
import os
import json
import hashlib
import redis.asyncio as redis

OSRM = os.getenv("OSRM_BASE_URL", "http://localhost:5000")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
cache = redis.from_url(REDIS_URL)

async def get_routes(lat, lng, dest_lat, dest_lng):
    # Cache key based on rounded coords (50m precision)
    key = hashlib.md5(
        f"{lat:.3f}{lng:.3f}{dest_lat:.3f}{dest_lng:.3f}".encode()
    ).hexdigest()

    # Try cache first
    try:
        cached = await cache.get(key)
        if cached:
            print("Cache hit!")
            return json.loads(cached)
    except:
        pass

    # Fetch from OSRM
    try:
        url = (
            f"{OSRM}/route/v1/driving/"
            f"{lng},{lat};{dest_lng},{dest_lat}"
            f"?alternatives=3&steps=true&geometries=geojson"
            f"&overview=full&annotations=true"
        )
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(url)
            data = r.json()

        routes = []
        for i, route in enumerate(data.get("routes", [])):
            routes.append({
                "index": i,
                "duration": round(route["duration"] / 60, 2),
                "distance": round(route["distance"] / 1000, 2),
                "geojson": route["geometry"],
                "legs": route["legs"],
                "isRecommended": False,
            })
        if routes:
            # Cache for 60 seconds
            try:
                await cache.setex(key, 60, json.dumps(routes))
            except:
                pass
            return routes

    except Exception as e:
        print(f"OSRM not available, using mock routes: {e}")

    # Mock fallback
    return [
        {
            "index": 0,
            "duration": 12.5,
            "distance": 4.2,
            "trafficLevel": "Medium",
            "speed": 32.0,
            "isRecommended": False,
            "geojson": {
                "type": "LineString",
                "coordinates": [
                    [lng, lat],
                    [(lng + dest_lng) / 2, (lat + dest_lat) / 2 + 0.005],
                    [dest_lng, dest_lat],
                ],
            },
            "legs": [{"distance": 4200}],
        },
        {
            "index": 1,
            "duration": 14.2,
            "distance": 3.8,
            "trafficLevel": "High",
            "speed": 18.0,
            "isRecommended": False,
            "geojson": {
                "type": "LineString",
                "coordinates": [
                    [lng, lat],
                    [(lng + dest_lng) / 2, (lat + dest_lat) / 2 - 0.005],
                    [dest_lng, dest_lat],
                ],
            },
            "legs": [{"distance": 3800}],
        },
    ]