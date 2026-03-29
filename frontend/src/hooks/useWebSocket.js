import { useEffect, useRef } from "react";
import { useRouteStore } from "../store/routeStore";

export function useWebSocket() {
  const ws = useRef(null);
  const { userPosition, destination, setRoutes } = useRouteStore();

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws/track");
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setRoutes(data.routes);
    };
    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    if (!userPosition || !destination || ws.current?.readyState !== 1) return;
    ws.current.send(
      JSON.stringify({
        lat: userPosition.lat,
        lng: userPosition.lng,
        dest_lat: destination.lat,
        dest_lng: destination.lng,
        timestamp: Date.now(),
      }),
    );
  }, [userPosition]); // fires every time GPS updates
}