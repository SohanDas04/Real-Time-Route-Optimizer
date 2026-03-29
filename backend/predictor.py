from datetime import datetime

async def score_route(route, timestamp_ms):
    dt = datetime.fromtimestamp(timestamp_ms / 1000)
    hour = dt.hour
    weekday = dt.weekday()

    # Simulate traffic based on time of day
    is_weekday = weekday < 5
    if is_weekday and (8 <= hour <= 10 or 17 <= hour <= 20):
        level, speed = "High", 18.0
    elif is_weekday and (10 < hour < 17):
        level, speed = "Medium", 32.0
    else:
        level, speed = "Low", 45.0

    route["trafficLevel"] = level
    route["speed"] = speed
    return route["duration"]  # lower = better