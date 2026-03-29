import csv, random
from datetime import datetime, timedelta

with open("traffic_data.csv", "a", newline="") as f:  # "a" to append, not overwrite
    w = csv.writer(f)
    base = datetime(2025, 1, 1)
    random.seed(42)
    segments = [
        (20.358, 85.821, 20.350, 85.830),
        (20.350, 85.830, 20.344, 85.838),
        (20.296, 85.824, 20.354, 85.831),
    ]
    for day in range(60):
        for hour in range(24):
            for seg in segments:
                dt = base + timedelta(days=day, hours=hour)
                weekday = dt.weekday()
                if weekday < 5 and (8 <= hour <= 10 or 17 <= hour <= 20):
                    speed = random.uniform(10, 20)
                elif weekday < 5 and (10 < hour < 17):
                    speed = random.uniform(25, 40)
                else:
                    speed = random.uniform(40, 55)
                w.writerow([dt.isoformat(), hour, weekday,
                            seg[0], seg[1], seg[2], seg[3],
                            round(speed, 2), 50])

print("Done! Data appended to traffic_data.csv")