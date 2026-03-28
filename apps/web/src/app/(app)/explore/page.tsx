import { createClient } from "@/lib/supabase/server";
import { COURSE_LIST_SELECT } from "@/lib/supabase/selects";
import type { Course, OlympiadType } from "@/lib/types";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage() {
  const supabase = await createClient();

  const [coursesRes, olympiadTypesRes] = await Promise.all([
    supabase
      .from("courses")
      .select(COURSE_LIST_SELECT)
      .eq("is_active", true)
      .order("is_featured", { ascending: false }),
    supabase.from("olympiad_types").select("*").order("id"),
  ]);

  if (coursesRes.error) {
    throw new Error(coursesRes.error.message);
  }

  return (
    <ExploreClient
      initialCourses={(coursesRes.data as Course[]) ?? []}
      olympiadTypes={(olympiadTypesRes.data as OlympiadType[]) ?? []}
    />
  );
}
