"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveResearchQuizResult({
  competition,
  quiz_slug,
  score_pct,
  answers,
  detailed_results,
}: {
  competition: string;
  quiz_slug: string;
  score_pct: number;
  answers: Record<string, number>;
  detailed_results: {
    question_id: string;
    picked: number;
    correct: number;
    prompt: string;
    options: string[];
  }[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const { error } = await supabase.from("research_quiz_results").insert({
    user_id: user.id,
    competition,
    quiz_slug,
    score_pct,
    answers,
    detailed_results,
  });

  if (error) {
    console.error("Error saving research quiz result:", error);
    return { error: error.message };
  }

  revalidatePath("/research-quiz");
  return { success: true };
}
