import { Marker } from "react-map-gl/maplibre";

export function UserMarker({ position }) {
  return (
    <Marker longitude={position.lng} latitude={position.lat} anchor="center">
      <div className="relative flex items-center justify-center">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10" />
        <div className="absolute w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60" />
      </div>
    </Marker>
  );
}
