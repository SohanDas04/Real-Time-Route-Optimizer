import { create } from "zustand";

export const useRouteStore = create((set) => ({
  userPosition: null,
  destination: null,
  routes: [],
  selectedRouteIndex: 0,
  isLoading: false,

  setUserPosition: (pos) => set({ userPosition: pos }),
  setDestination: (dest) => set({ destination: dest }),
  setRoutes: (routes) => set({ routes }),
  setSelectedRoute: (i) => set({ selectedRouteIndex: i }),
  setLoading: (v) => set({ isLoading: v }),
}));
