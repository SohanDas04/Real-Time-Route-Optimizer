import { useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import { useRouteStore } from "../store/routeStore";

export function useAutoReroute() {
  const userPosition = useRouteStore((s) => s.userPosition);
  const routes = useRouteStore((s) => s.routes);
  const followingRouteIndex = useRouteStore((s) => s.followingRouteIndex);
  const destination = useRouteStore((s) => s.destination);
  const isFollowing = useRouteStore((s) => s.isFollowing);
  const setRoutes = useRouteStore((s) => s.setRoutes);
  const setLoading = useRouteStore((s) => s.setLoading);
  const setEtaSeconds = useRouteStore((s) => s.setEtaSeconds);
  const setIsFollowing = useRouteStore((s) => s.setIsFollowing);
  const lastPositionRef = useRef(null);

  useEffect(() => {
    if (!isFollowing) return;
    if (!userPosition || !routes.length || !destination) return;

    const selectedRoute = routes[followingRouteIndex ?? 0];
    if (!selectedRoute?.geojson?.coordinates?.length) return;

    // Only recalculate if user has moved at least 10 meters
    if (lastPositionRef.current) {
      const prev = turf.point([
        lastPositionRef.current.lng,
        lastPositionRef.current.lat,
      ]);
      const curr = turf.point([userPosition.lng, userPosition.lat]);
      const movedMeters =
        turf.distance(prev, curr, { units: "kilometers" }) * 1000;
      if (movedMeters < 10) return; // skip if barely moved
    }
    lastPositionRef.current = userPosition;

    const userPoint = turf.point([userPosition.lng, userPosition.lat]);
    const destPoint = turf.point([destination.lng, destination.lat]);
    const remainingDistKm = turf.distance(userPoint, destPoint, {
      units: "kilometers",
    });
    const speedKmh = selectedRoute.speed || 30;
    const etaSeconds = Math.round((remainingDistKm / speedKmh) * 3600);
    setEtaSeconds(etaSeconds);

    // Arrived check
    if (remainingDistKm * 1000 < 50) {
      alert("You have arrived at your destination!");
      setIsFollowing(false, null);
      setEtaSeconds(null);
      return;
    }

    // Auto-reroute check
    const line = turf.lineString(selectedRoute.geojson.coordinates);
    const snapped = turf.nearestPointOnLine(line, userPoint);
    const distFromRouteMeters = snapped.properties.dist * 1000;
    const now = Date.now();

    if (distFromRouteMeters > 80 && now - lastRerouteRef.current > 10000) {
      lastRerouteRef.current = now;
      setLoading(true);
      const ws = new WebSocket("ws://localhost:8000/ws/track");
      ws.onopen = () =>
        ws.send(
          JSON.stringify({
            lat: userPosition.lat,
            lng: userPosition.lng,
            dest_lat: destination.lat,
            dest_lng: destination.lng,
            timestamp: Date.now(),
          }),
        );
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setRoutes(data.routes);
        setLoading(false);
        ws.close();
      };
      ws.onerror = () => setLoading(false);
    }
  }, [userPosition, isFollowing]);
}
