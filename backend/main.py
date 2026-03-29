from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from router import get_routes
from predictor import score_route
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"],
    allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
async def health(): return {"status": "ok"}

@app.websocket("/ws/track")
async def track(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            # data = {lat, lng, dest_lat, dest_lng, timestamp}
            routes = await get_routes(
                data["lat"], data["lng"],
                data["dest_lat"], data["dest_lng"]
            )
            for route in routes:
                route["score"] = await score_route(route, data["timestamp"])

            routes.sort(key=lambda r: r["score"])
            routes[0]["isRecommended"] = True
            await websocket.send_json({"routes": routes})
    except WebSocketDisconnect:
        print("Client disconnected")