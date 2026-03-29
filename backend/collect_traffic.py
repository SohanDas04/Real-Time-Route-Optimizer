import asyncio, httpx, csv, os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
TOMTOM_KEY = os.getenv("TOMTOM_API_KEY")

# Add more segments across Bhubaneswar
SEGMENTS = [
    (20.358, 85.821, 20.350, 85.830),
    (20.350, 85.830, 20.344, 85.838),
    (20.296, 85.824, 20.354, 85.831),
    (20.301, 85.817, 20.310, 85.825),
    (20.320, 85.815, 20.330, 85.820),
    (20.265, 85.840, 20.275, 85.850),
    (20.280, 85.830, 20.290, 85.840),
    (20.340, 85.810, 20.350, 85.820),
    (20.360, 85.835, 20.370, 85.845),
    (20.315, 85.845, 20.325, 85.855),
]

async def fetch_segment_speed(lat1, lng1, lat2, lng2):
    url = (f"https://api.tomtom.com/traffic/services/4/flowSegmentData/"
           f"relative0/10/json?point={lat1},{lng1}&key={TOMTOM_KEY}")
    try:
        async with httpx.AsyncClient() as c:
            r = await c.get(url, timeout=5)
            return r.json()
    except:
        return {}

async def collect():
    with open("traffic_data.csv", "a", newline="") as f:
        w = csv.writer(f)
        now = datetime.now()
        for seg in SEGMENTS:
            data = await fetch_segment_speed(*seg)
            frc = data.get("flowSegmentData", {})
            current = frc.get("currentSpeed", 0)
            free_flow = frc.get("freeFlowSpeed", 50)
            if current > 0:
                w.writerow([
                    now.isoformat(), now.hour, now.weekday(),
                    seg[0], seg[1], seg[2], seg[3],
                    current, free_flow
                ])
                print(f"[{now.strftime('%H:%M')}] {seg[:2]} → {current} km/h")

async def main():
    print("Starting traffic collection every 5 minutes...")
    print("Keep this running! Press Ctrl+C to stop.")
    while True:
        await collect()
        print("--- waiting 5 minutes ---")
        await asyncio.sleep(300)  # 5 minutes

asyncio.run(main())