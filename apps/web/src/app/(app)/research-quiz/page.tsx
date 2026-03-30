import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { ResearchQuizHub } from "@/components/research-quiz/ResearchQuizHub";

export const metadata: Metadata = {
  title: "Free practice quizzes (YMRC & YSRC) - Parikshanam",
  description:
    "Young Mathematical Research Challenge (mathematics) and Young Scientific Research Challenge (science) sample quizzes. Sign in to practice.",
};

export default async function ResearchQuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  let completedQuizSlugs: string[] = [];

  if (user) {
    const [profileRes, resultsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("research_quiz_results").select("quiz_slug").eq("user_id", user.id)
    ]);
    
    profile = profileRes.data;
    completedQuizSlugs = (resultsRes.data || []).map(r => r.quiz_slug);
  }

  return <ResearchQuizHub userProfile={profile} completedQuizSlugs={completedQuizSlugs} />;
}
