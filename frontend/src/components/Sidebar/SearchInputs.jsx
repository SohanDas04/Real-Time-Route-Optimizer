import { useState, useEffect, useRef } from "react";
import { useRouteStore } from "../../store/routeStore";
import { geocode } from "../../services/api";

export function SearchInputs() {
  const [destInput, setDestInput] = useState("");
  const [originInput, setOriginInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [selectedDest, setSelectedDest] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [usingGPS, setUsingGPS] = useState(true);
  const debounceRef = useRef(null);
  const originDebounceRef = useRef(null);
  const destRef = useRef(null);
  const originRef = useRef(null);

  const userPosition = useRouteStore((s) => s.userPosition);
  const setDestination = useRouteStore((s) => s.setDestination);
  const setOrigin = useRouteStore((s) => s.setOrigin); 
  const setRoutes = useRouteStore((s) => s.setRoutes);
  const setLoading = useRouteStore((s) => s.setLoading);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (destRef.current && !destRef.current.contains(e.target))
        setSuggestions([]);
      if (originRef.current && !originRef.current.contains(e.target))
        setOriginSuggestions([]);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (destInput.length < 3) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await geocode(destInput);
      setSuggestions(results.slice(0, 5));
    }, 400);
  }, [destInput]);

  useEffect(() => {
    if (usingGPS || originInput.length < 3) {
      setOriginSuggestions([]);
      return;
    }
    clearTimeout(originDebounceRef.current);
    originDebounceRef.current = setTimeout(async () => {
      const results = await geocode(originInput);
      setOriginSuggestions(results.slice(0, 5));
    }, 400);
  }, [originInput, usingGPS]);

  const handleSelectDest = (place) => {
    setDestInput(place.display_name);
    setSelectedDest({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setSuggestions([]);
  };

  const handleSelectOrigin = (place) => {
    setOriginInput(place.display_name);
    setSelectedOrigin({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });
    setOriginSuggestions([]);
  };

  const handleFind = async () => {
    let origin = null;

    if (usingGPS) {
      if (!userPosition) {
        alert("Waiting for GPS signal...");
        return;
      }
      origin = userPosition;
    } else {
      // If user typed but didn't pick from dropdown, geocode it now
      if (selectedOrigin) {
        origin = selectedOrigin;
      } else if (originInput.trim().length > 2) {
        const results = await geocode(originInput);
        if (results && results[0]) {
          origin = {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
          };
        }
      }
      if (!origin) {
        alert(
          "Starting point not found. Please select from the dropdown suggestions.",
        );
        return;
      }
    }

    let dest = null;
    if (selectedDest) {
      dest = selectedDest;
    } else if (destInput.trim().length > 2) {
      const results = await geocode(destInput);
      if (results && results[0]) {
        dest = {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
      }
    }
    if (!dest) {
      alert(
        "Destination not found. Please select from the dropdown suggestions.",
      );
      return;
    }
    setOrigin(origin);
    setLoading(true);
    setDestination(dest);

    const ws = new WebSocket("ws://localhost:8000/ws/track");
    ws.onopen = () =>
      ws.send(
        JSON.stringify({
          lat: origin.lat,
          lng: origin.lng,
          dest_lat: dest.lat,
          dest_lng: dest.lng,
          timestamp: Date.now(),
        }),
      );
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRoutes(data.routes);
      setLoading(false);
      ws.close();
    };
    ws.onerror = () => {
      alert("Backend not reachable. Is uvicorn running?");
      setLoading(false);
    };
  };

  return (
    <div className="space-y-4">
      {/* Starting Point */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Starting Point
          </label>
          <button
            onClick={() => {
              setUsingGPS(!usingGPS);
              setOriginInput("");
              setSelectedOrigin(null);
            }}
            className={`text-xs px-3 py-1 rounded-md font-medium border transition-all duration-200 ${
              usingGPS
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-300 hover:border-blue-400"
            }`}
          >
            {usingGPS ? "Live Location" : "Manual Input"}
          </button>
        </div>

        {usingGPS ? (
          <div className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400 font-mono">
            {userPosition
              ? `${userPosition.lat.toFixed(5)}, ${userPosition.lng.toFixed(5)}`
              : "Acquiring GPS signal..."}
          </div>
        ) : (
          <div className="relative" ref={originRef}>
            <input
              type="text"
              value={originInput}
              onChange={(e) => {
                setOriginInput(e.target.value);
                setSelectedOrigin(null);
              }}
              placeholder="Search starting location..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                text-sm text-gray-700 placeholder-gray-400 transition-all"
            />
            {originSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                {originSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectOrigin(s)}
                    className="px-3 py-2.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Destination */}
      <div className="relative" ref={destRef}>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Destination
        </label>
        <input
          type="text"
          value={destInput}
          onChange={(e) => {
            setDestInput(e.target.value);
            setSelectedDest(null);
          }}
          placeholder="Search destination..."
          className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-gray-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-sm text-gray-700 placeholder-gray-400 transition-all"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSelectDest(s)}
                className="px-3 py-2.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleFind}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
          text-white font-semibold rounded-lg transition-colors duration-200 text-sm
          shadow-sm hover:shadow-md"
      >
        Find Routes
      </button>
    </div>
  );
}
