import { useEffect } from "react";
import { useRouteStore } from "../store/routeStore";

export function useGeolocation() {
  const setUserPosition = useRouteStore((s) => s.setUserPosition);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by this browser");
      return;
    }
    console.log("Starting GPS watch...");
    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        console.log(
          "GPS position received:",
          coords.latitude,
          coords.longitude,
        );
        setUserPosition({
          lat: coords.latitude,
          lng: coords.longitude,
          heading: coords.heading,
          accuracy: coords.accuracy,
        });
      },
      (err) => {
        console.error("GPS error code:", err.code, "message:", err.message);
        // err.code 1 = permission denied
        // err.code 2 = position unavailable
        // err.code 3 = timeout
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);
}
