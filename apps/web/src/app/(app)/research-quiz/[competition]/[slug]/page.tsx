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
    description: `${quiz.subtitle} — ${quiz.questions.length} practice questions.`,
  };
}

export default async function ResearchQuizPlayPage({ params }: Props) {
  const { competition, slug } = await params;
  if (!isCompetitionId(competition)) notFound();

  const quiz = getQuizByCompetition(competition, slug);
  if (!quiz) notFound();

  const competitionAbbr = researchQuizData[competition].abbr;

  return <ResearchQuizPlayerClient quiz={quiz} competitionAbbr={competitionAbbr} />;
}
