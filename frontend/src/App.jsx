import { useGeolocation } from "./hooks/useGeolocation";
import { MapView } from "./components/Map/MapView";
import { RouteList } from "./components/Sidebar/RouteList";
import { SearchInputs } from "./components/Sidebar/SearchInputs";
import { useRouteStore } from "./store/routeStore";
import { useAutoReroute } from "./hooks/useAutoReroute";

export default function App() {
  useAutoReroute();
  useGeolocation();
  const routes = useRouteStore((s) => s.routes);
  const userPosition = useRouteStore((s) => s.userPosition);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-none">
              RouteOptimizer
            </h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">
              Real-time traffic routing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* GPS Status */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${userPosition ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
            />
            <span className="text-xs text-gray-500">
              {userPosition ? "GPS Active" : "No GPS"}
            </span>
          </div>

          {/* Route count badge */}
          {routes.length > 0 && (
            <div className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
              {routes.length} route{routes.length > 1 ? "s" : ""} found
            </div>
          )}

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-600">Live</span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[380px] flex flex-col bg-white border-r border-gray-200 shadow-sm z-10 overflow-y-auto">
          <div className="p-5 space-y-5">
            <SearchInputs />
            <div className="border-t border-gray-100" />
            <RouteList />
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapView />

          {/* Map overlay info */}
          {routes.length > 0 && (
            <div className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 z-10">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                Best Route
              </p>
              <p className="text-sm font-bold text-gray-800">
                {routes.find((r) => r.isRecommended)?.duration} mins
              </p>
              <p className="text-xs text-gray-500">
                {routes.find((r) => r.isRecommended)?.distance} km away
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
