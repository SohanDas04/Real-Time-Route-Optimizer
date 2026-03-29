import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouteStore } from "../../store/routeStore";
import { RouteLayer } from "./RouteLayer";
import { UserMarker } from "./UserMarker";

const MAP_STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`;

export function MapView() {
  const userPosition = useRouteStore((s) => s.userPosition);
  return (
    <Map
      mapStyle={MAP_STYLE}
      initialViewState={{ longitude: 85.82, latitude: 20.35, zoom: 14 }}
      style={{ width: "100%", height: "100%" }}
    >
      <RouteLayer />
      {userPosition && <UserMarker position={userPosition} />}
    </Map>
  );
}
