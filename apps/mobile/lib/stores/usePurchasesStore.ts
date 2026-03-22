import { create } from "zustand";

import type { Purchase } from "@/types";

interface PurchasesState {
  purchases: Purchase[];
  loading: boolean;
  error: Error | null;
  actions: {
    setPurchases: (purchases: Purchase[]) => void;
    setLoading: (v: boolean) => void;
    setError: (e: Error | null) => void;
    addPurchase: (purchase: Purchase) => void;
  };
}

export const usePurchasesStore = create<PurchasesState>((set) => ({
  purchases: [],
  loading: true,
  error: null,
  actions: {
    setPurchases: (purchases) => set({ purchases }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addPurchase: (purchase) =>
      set((s) => ({ purchases: [purchase, ...s.purchases] })),
  },
}));
