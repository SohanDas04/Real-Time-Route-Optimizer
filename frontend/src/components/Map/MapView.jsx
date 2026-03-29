import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { useRef, useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouteStore } from "../../store/routeStore";
import { RouteLayer } from "./RouteLayer";
import { UserMarker } from "./UserMarker";

const MAP_STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`;

export function MapView() {
  const mapRef = useRef(null);
  const userPosition = useRouteStore((s) => s.userPosition);
  const origin = useRouteStore((s) => s.origin);
  const destination = useRouteStore((s) => s.destination);
  const routes = useRouteStore((s) => s.routes);
  const [showOriginPopup, setShowOriginPopup] = useState(false);
  const [showDestPopup, setShowDestPopup] = useState(false);

  // Auto-fly to fit both markers when routes are found
  useEffect(() => {
    if (!origin || !destination || !mapRef.current) return;
    const map = mapRef.current.getMap();

    const minLng = Math.min(origin.lng, destination.lng);
    const maxLng = Math.max(origin.lng, destination.lng);
    const minLat = Math.min(origin.lat, destination.lat);
    const maxLat = Math.max(origin.lat, destination.lat);

    const lngPad = Math.max((maxLng - minLng) * 0.3, 0.01);
    const latPad = Math.max((maxLat - minLat) * 0.3, 0.01);

    map.fitBounds(
      [
        [minLng - lngPad, minLat - latPad],
        [maxLng + lngPad, maxLat + latPad],
      ],
      { duration: 1200, padding: 80 },
    );
  }, [origin, destination, routes]);

  return (
    <Map
      ref={mapRef}
      mapStyle={MAP_STYLE}
      initialViewState={{ longitude: 85.82, latitude: 20.35, zoom: 14 }}
      style={{ width: "100%", height: "100%" }}
    >
      <RouteLayer />

      {/* Live GPS dot — only when no manual origin set */}
      {userPosition && !origin && <UserMarker position={userPosition} />}

      {/* Origin marker — green */}
      {origin && (
        <Marker
          longitude={origin.lng}
          latitude={origin.lat}
          anchor="bottom"
          onClick={() => {
            setShowDestPopup(false);
            setShowOriginPopup(true);
          }}
        >
          <div className="flex flex-col items-center cursor-pointer group">
            <div
              className="w-9 h-9 bg-green-500 rounded-full border-2 border-white
              shadow-lg flex items-center justify-center
              group-hover:scale-110 transition-transform duration-150"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="white" />
                <path
                  d="M12 2v3M12 19v3M2 12h3M19 12h3"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="w-0.5 h-3 bg-green-500 opacity-80" />
            <div className="w-2 h-2 bg-green-500 rounded-full opacity-60" />
          </div>
        </Marker>
      )}

      {showOriginPopup && origin && (
        <Popup
          longitude={origin.lng}
          latitude={origin.lat}
          anchor="bottom"
          offset={52}
          onClose={() => setShowOriginPopup(false)}
          closeOnClick={false}
        >
          <div className="px-1 py-0.5">
            <p className="text-xs font-bold text-green-600 mb-0.5">
              Starting Point
            </p>
            <p className="text-xs text-gray-500 font-mono">
              {origin.lat.toFixed(5)}, {origin.lng.toFixed(5)}
            </p>
          </div>
        </Popup>
      )}

      {/* Destination marker — red */}
      {destination && (
        <Marker
          longitude={destination.lng}
          latitude={destination.lat}
          anchor="bottom"
          onClick={() => {
            setShowOriginPopup(false);
            setShowDestPopup(true);
          }}
        >
          <div className="flex flex-col items-center cursor-pointer group">
            <div
              className="w-9 h-9 bg-red-500 rounded-full border-2 border-white
              shadow-lg flex items-center justify-center
              group-hover:scale-110 transition-transform duration-150"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="w-0.5 h-3 bg-red-500 opacity-80" />
            <div className="w-2 h-2 bg-red-500 rounded-full opacity-60" />
          </div>
        </Marker>
      )}

      {showDestPopup && destination && (
        <Popup
          longitude={destination.lng}
          latitude={destination.lat}
          anchor="bottom"
          offset={52}
          onClose={() => setShowDestPopup(false)}
          closeOnClick={false}
        >
          <div className="px-1 py-0.5">
            <p className="text-xs font-bold text-red-500 mb-0.5">Destination</p>
            <p className="text-xs text-gray-500 font-mono">
              {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
