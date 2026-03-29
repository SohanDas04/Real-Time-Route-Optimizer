import { Source, Layer } from "react-map-gl/maplibre";
import { useRouteStore } from "../../store/routeStore";

export function RouteLayer() {
  const routes = useRouteStore((s) => s.routes);
  const selected = useRouteStore((s) => s.selectedRouteIndex);

  return routes.map((route, i) => (
    <Source key={i} id={`route-${i}`} type="geojson" data={route.geojson}>
      <Layer
        id={`line-${i}`}
        type="line"
        paint={{
          "line-color": i === selected ? "#22c55e" : "#f59e0b",
          "line-width": i === selected ? 6 : 3,
          "line-opacity": i === selected ? 1 : 0.5,
        }}
        layout={{ "line-cap": "round", "line-join": "round" }}
      />
    </Source>
  ));
}