import { create } from "zustand";

import type { ClassLevel, Profile } from "@/types";

interface ProfileState {
  profile: Profile | null;
  classLevels: ClassLevel[];
  selectedClass: ClassLevel | null;
  loading: boolean;
  actions: {
    setProfile: (profile: Profile | null) => void;
    setClassLevels: (levels: ClassLevel[]) => void;
    setSelectedClass: (cl: ClassLevel | null) => void;
    setLoading: (v: boolean) => void;
  };
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  classLevels: [],
  selectedClass: null,
  loading: true,
  actions: {
    setProfile: (profile) => set({ profile }),
    setClassLevels: (classLevels) => set({ classLevels }),
    setSelectedClass: (selectedClass) => set({ selectedClass }),
    setLoading: (loading) => set({ loading }),
  },
}));
