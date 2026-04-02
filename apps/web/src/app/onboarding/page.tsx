import { createClient } from "@/lib/supabase/server";
import type { ClassLevel, School } from "@/lib/types";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const [{ data: classLevels, error: classError }, { data: schools, error: schoolsError }] =
    await Promise.all([
      supabase.from("class_levels").select("*").order("min_age", { ascending: true }),
      supabase.from("schools").select("id, name").order("name", { ascending: true }),
    ]);

  return (
    <OnboardingClient
      initialClassLevels={(classLevels as ClassLevel[]) ?? []}
      classLevelsFetchFailed={!!classError}
      initialSchools={(schools as School[]) ?? []}
      schoolsFetchFailed={!!schoolsError}
    />
  );
}
