import { useRouteStore } from "../../store/routeStore";
import { RouteCard } from "./RouteCard";

export function RouteList() {
  const routes = useRouteStore((s) => s.routes);
  const isLoading = useRouteStore((s) => s.isLoading);
  const selectedRouteIndex = useRouteStore((s) => s.selectedRouteIndex);
  const setSelectedRoute = useRouteStore((s) => s.setSelectedRoute);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Available Routes
      </h2>
      {isLoading ? (
        <div className="text-sm text-gray-400 text-center py-8">
          Finding best routes...
        </div>
      ) : routes.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-8">
          Enter a destination to find routes.
        </div>
      ) : (
        routes.map((route, i) => (
          <RouteCard
            key={i}
            route={route}
            index={i}
            selected={selectedRouteIndex === i}
            onSelect={setSelectedRoute}
          />
        ))
      )}
    </div>
  );
}
