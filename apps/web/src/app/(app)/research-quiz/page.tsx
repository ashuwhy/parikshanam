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
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    profile = data;
  }

  return <ResearchQuizHub userProfile={profile} />;
}
