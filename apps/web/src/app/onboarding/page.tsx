import { createClient } from "@/lib/supabase/server";
import type { ClassLevel } from "@/lib/types";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("class_levels")
    .select("*")
    .order("min_age", { ascending: true });

  return (
    <OnboardingClient
      initialClassLevels={(data as ClassLevel[]) ?? []}
      classLevelsFetchFailed={!!error}
    />
  );
}
