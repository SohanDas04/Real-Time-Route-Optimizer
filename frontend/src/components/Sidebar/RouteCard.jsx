import { useRouteStore } from "../../store/routeStore";

const TRAFFIC_STYLES = {
  Low: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  Medium: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  High: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

export function RouteCard({ route, index, selected, onSelect }) {
  const ts = TRAFFIC_STYLES[route.trafficLevel] || TRAFFIC_STYLES.Medium;
  const etaSeconds = useRouteStore((s) => s.etaSeconds);
  const isFollowing = useRouteStore((s) => s.isFollowing);
  const followingRouteIndex = useRouteStore((s) => s.followingRouteIndex);
  const setIsFollowing = useRouteStore((s) => s.setIsFollowing);
  const setEtaSeconds = useRouteStore((s) => s.setEtaSeconds);
  const destination = useRouteStore((s) => s.destination);

  // This specific card is the one being followed
  const isThisRouteFollowed = isFollowing && followingRouteIndex === index;

  const handleFollowRoute = (e) => {
    e.stopPropagation();
    setIsFollowing(true, index);
    setEtaSeconds(Math.round(route.duration * 60)); 
  };

  const handleStopFollowing = (e) => {
    e.stopPropagation();
    setIsFollowing(false, null);
    setEtaSeconds(null);
  };

  const formatEta = (secs) => {
    if (secs === null || secs === undefined) return "--";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
    return `${s}s`;
  };

  return (
    <div
      onClick={() => onSelect(index)}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Route {index + 1}
          </span>
          {route.isRecommended && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
              Recommended
            </span>
          )}
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-xs text-gray-400 mb-0.5">Duration</p>
          <p className="text-sm font-bold text-gray-800">
            {route.duration}{" "}
            <span className="font-normal text-gray-500">min</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-xs text-gray-400 mb-0.5">Distance</p>
          <p className="text-sm font-bold text-gray-800">
            {route.distance}{" "}
            <span className="font-normal text-gray-500">km</span>
          </p>
        </div>
      </div>

      {/* Traffic */}
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-lg border mb-3 ${ts.bg} ${ts.border}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${ts.dot}`} />
          <span className={`text-xs font-semibold ${ts.text}`}>
            {route.trafficLevel} Traffic
          </span>
        </div>
        <span className="text-xs text-gray-500">{route.speed} km/h</span>
      </div>

      {/* Live ETA — only on the route being followed */}
      {isThisRouteFollowed && (
        <div className="bg-gray-900 rounded-lg px-3 py-2.5 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400 font-medium">
                Live ETA
              </span>
            </div>
            <span className="text-lg font-bold text-white font-mono">
              {formatEta(etaSeconds)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Updates as you move closer to destination
          </p>
        </div>
      )}

      {/* Follow button — only on selected card */}
      {selected && destination && (
        <button
          onClick={
            isThisRouteFollowed ? handleStopFollowing : handleFollowRoute
          }
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isThisRouteFollowed
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isThisRouteFollowed ? "Stop Following" : "Follow Route"}
        </button>
      )}

      {route.isRecommended && (
        <p className="mt-2.5 text-xs text-blue-500 font-medium">
          Selected by ML — least congestion
        </p>
      )}
    </div>
  );
}
