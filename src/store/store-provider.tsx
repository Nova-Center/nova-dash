"use client";

import { createContext, useContext, type ReactNode } from "react";
import { create } from "zustand";

// Define the store
interface DashboardStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  darkMode: false,
  setDarkMode: (dark) => set({ darkMode: dark }),
}));

// Create a context
const DashboardStoreContext = createContext<typeof useDashboardStore | null>(
  null
);

// Create a provider
export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <DashboardStoreContext.Provider value={useDashboardStore}>
      {children}
    </DashboardStoreContext.Provider>
  );
}

// Create a hook to use the store
export function useStore<T>(selector: (state: DashboardStore) => T): T {
  const store = useContext(DashboardStoreContext);

  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return store(selector);
}
