import { create } from "zustand";

export const useRouteStore = create((set) => ({
  userPosition: null,
  destination: null,
  origin: null,
  routes: [],
  selectedRouteIndex: 0,
  isLoading: false,
  etaSeconds: null,
  isFollowing: false,
  followingRouteIndex: null,

  setUserPosition: (pos) => set({ userPosition: pos }),
  setDestination: (dest) => set({ destination: dest }),
  setOrigin: (origin) => set({ origin }),
  setRoutes: (routes) => set({ routes }),
  setSelectedRoute: (i) =>
    set({
      selectedRouteIndex: i,
      isFollowing: false,
      etaSeconds: null,
      followingRouteIndex: null,
    }),
  setLoading: (v) => set({ isLoading: v }),
  setEtaSeconds: (eta) => set({ etaSeconds: eta }),
  setIsFollowing: (v, routeIndex) =>
    set({ isFollowing: v, followingRouteIndex: v ? routeIndex : null }),
}));
