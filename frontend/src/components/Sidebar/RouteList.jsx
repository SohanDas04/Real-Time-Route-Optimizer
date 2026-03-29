import { useRouteStore } from "../../store/routeStore";
import { RouteCard } from "./RouteCard";

const MOCK_ROUTES = [
  {
    isRecommended: true,
    duration: 3.55,
    distance: 2.07,
    trafficLevel: "Medium",
    speed: 35,
    geojson: { type: "LineString", coordinates: [] },
  },
  {
    isRecommended: false,
    duration: 3.56,
    distance: 1.41,
    trafficLevel: "High",
    speed: 23.8,
    geojson: { type: "LineString", coordinates: [] },
  },
];

export function RouteList() {
  const routes = useRouteStore((s) => s.routes);
  const isLoading = useRouteStore((s) => s.isLoading);
  const displayRoutes = routes.length > 0 ? routes : MOCK_ROUTES;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Available Routes
      </h2>
      {isLoading ? (
        <div className="text-sm text-gray-400 text-center py-8">
          Finding best routes...
        </div>
      ) : (
        displayRoutes.map((route, i) => (
          <RouteCard key={i} route={route} index={i} />
        ))
      )}
    </div>
  );
}
