import { useGeolocation } from "./hooks/useGeolocation";
import { MapView } from "./components/Map/MapView";
import { RouteList } from "./components/Sidebar/RouteList";
import { SearchInputs } from "./components/Sidebar/SearchInputs";

export default function App() {
  useGeolocation();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-[380px] flex flex-col gap-4 p-5 bg-white shadow-xl z-10 overflow-y-auto">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="text-base font-bold text-gray-800 tracking-tight">
            Real Time Route Optimizer
          </h1>
        </div>
        <SearchInputs />
        <RouteList />
      </aside>
      <main className="flex-1 relative">
        <MapView />
      </main>
    </div>
  );
}
