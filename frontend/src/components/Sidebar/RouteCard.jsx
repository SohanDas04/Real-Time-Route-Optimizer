const TRAFFIC_STYLES = {
  Low: { dot: "bg-green-400", text: "text-green-600" },
  Medium: { dot: "bg-yellow-400", text: "text-yellow-600" },
  High: { dot: "bg-red-400", text: "text-red-600" },
};

export function RouteCard({ route, index, selected, onSelect }) {
  const ts = TRAFFIC_STYLES[route.trafficLevel] || TRAFFIC_STYLES.Medium;
  return (
    <div
      onClick={() => onSelect(index)}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        selected
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 bg-white hover:border-blue-300"
      }`}
    >
      {route.isRecommended && (
        <span
          className="inline-block mb-2 px-2 py-0.5 text-xs font-semibold
          bg-green-500 text-white rounded-full"
        >
          RECOMMENDED
        </span>
      )}
      <p className="text-sm">
        Time: <strong>{route.duration} mins</strong>
      </p>
      <p className="text-sm">
        Distance: <strong>{route.distance} km</strong>
      </p>
      <p className={`text-sm font-semibold ${ts.text}`}>
        Traffic: {route.trafficLevel}
      </p>
      <p className="text-sm">Speed: {route.speed} km/h</p>
      {route.isRecommended && (
        <p className="mt-2 text-xs text-green-600 border-t border-green-200 pt-2">
          ✓ Selected using ML (least traffic)
        </p>
      )}
    </div>
  );
}