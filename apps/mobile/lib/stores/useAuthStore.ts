import { create } from "zustand";

interface AuthState {
  isLoading: boolean;
  isOnboardingDone: boolean;
  actions: {
    setLoading: (v: boolean) => void;
    setOnboardingDone: (done: boolean) => void;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  isOnboardingDone: false,
  actions: {
    setLoading: (isLoading) => set({ isLoading }),
    setOnboardingDone: (isOnboardingDone) => set({ isOnboardingDone }),
  },
}));
