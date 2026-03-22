import { useRemoteData } from "@/lib/hooks/useRemoteData";

/** Subscribes to Supabase-backed queries and syncs into Zustand. */
export function DataSync() {
  useRemoteData();
  return null;
}
