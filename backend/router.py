import httpx, os

OSRM = os.getenv("OSRM_BASE_URL", "http://localhost:5000")

async def get_routes(lat, lng, dest_lat, dest_lng):
    url = (f"{OSRM}/route/v1/driving/"
           f"{lng},{lat};{dest_lng},{dest_lat}"
           f"?alternatives=3&steps=true&geometries=geojson"
           f"&overview=full&annotations=true")
    async with httpx.AsyncClient() as client:
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
    return routes