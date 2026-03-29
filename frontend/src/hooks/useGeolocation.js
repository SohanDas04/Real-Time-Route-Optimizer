import { useEffect } from "react";
import { useRouteStore } from "../store/routeStore";

export function useGeolocation() {
  const setUserPosition = useRouteStore((s) => s.setUserPosition);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      ({ coords }) =>
        setUserPosition({
          lat: coords.latitude,
          lng: coords.longitude,
          heading: coords.heading,
          accuracy: coords.accuracy,
        }),
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);
}
