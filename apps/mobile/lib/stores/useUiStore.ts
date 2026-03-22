import { create } from "zustand";

type TabKey = "home" | "search" | "my-courses";

interface UiState {
  activeTab: TabKey;
  isDrawerOpen: boolean;
  actions: {
    setActiveTab: (tab: TabKey) => void;
    setDrawerOpen: (open: boolean) => void;
  };
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: "home",
  isDrawerOpen: false,
  actions: {
    setActiveTab: (activeTab) => set({ activeTab }),
    setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  },
}));
