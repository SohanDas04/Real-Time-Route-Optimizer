import { useState } from "react";
import { useRouteStore } from "../../store/routeStore";

export function SearchInputs() {
  const [destInput, setDestInput] = useState("");
  const userPosition = useRouteStore((s) => s.userPosition);
  const setDestination = useRouteStore((s) => s.setDestination);
  const setLoading = useRouteStore((s) => s.setLoading);

  const handleFind = () => {
    if (!destInput) return;
    setLoading(true);
    // Phase 3: this will call the real backend
    // For now just simulates a loading state
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Starting Point
        </label>
        <div className="mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500">
          {userPosition
            ? `${userPosition.lat.toFixed(5)}, ${userPosition.lng.toFixed(5)}`
            : "Waiting for GPS..."}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Destination
        </label>
        <input
          type="text"
          value={destInput}
          onChange={(e) => setDestInput(e.target.value)}
          placeholder="e.g. KIIT University"
          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200
            focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
      </div>
      <button
        onClick={handleFind}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white
          font-semibold rounded-lg transition-colors duration-200 text-sm"
      >
        Find Routes
      </button>
    </div>
  );
}