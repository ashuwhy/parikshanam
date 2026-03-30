import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ResearchQuizPlayerClient from "@/components/research-quiz/ResearchQuizPlayerClient";
import {
  getQuizByCompetition,
  getResearchQuizStaticParams,
  isCompetitionId,
  researchQuizData,
} from "@/lib/research-quizzes";

type Props = { params: Promise<{ competition: string; slug: string }> };

export function generateStaticParams() {
  return getResearchQuizStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competition, slug } = await params;
  if (!isCompetitionId(competition)) return { title: "Quiz not found" };
  const quiz = getQuizByCompetition(competition, slug);
  if (!quiz) return { title: "Quiz not found" };
  const abbr = researchQuizData[competition].abbr;
  return {
    title: `${quiz.label} ${abbr} quiz - Parikshanam`,
    description: `${quiz.subtitle} - ${quiz.questions.length} practice questions.`,
  };
}

import { createClient } from "@/lib/supabase/server";

export default async function ResearchQuizPlayPage({ params }: Props) {
  const { competition, slug } = await params;
  if (!isCompetitionId(competition)) notFound();

  const quiz = getQuizByCompetition(competition, slug);
  if (!quiz) notFound();

  const competitionAbbr = researchQuizData[competition].abbr;

  // Check for existing attempt
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let hasAttempted = false;
  if (user) {
    const { data } = await supabase
      .from("research_quiz_results")
      .select("id")
      .eq("user_id", user.id)
      .eq("competition", competition)
      .eq("quiz_slug", slug)
      .maybeSingle();
    
    if (data) hasAttempted = true;
  }

  return (
    <ResearchQuizPlayerClient 
      quiz={quiz} 
      competitionAbbr={competitionAbbr} 
      hasAttempted={hasAttempted} 
    />
  );
}
