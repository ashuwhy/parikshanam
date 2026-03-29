import raw from "./quiz-data.json";
import type { ResearchQuizDocument, ResearchQuizPaper } from "./types";

const data = raw as ResearchQuizDocument;

export type { ResearchCompetition, ResearchQuestion, ResearchQuizDocument, ResearchQuizPaper } from "./types";

export type CompetitionId = "ymrc" | "ysrc";

export const researchQuizData = data;

export const YMRC_QUIZZES: ResearchQuizPaper[] = data.ymrc.quizzes;
export const YSRC_QUIZZES: ResearchQuizPaper[] = data.ysrc.quizzes;

export function isCompetitionId(value: string): value is CompetitionId {
  return value === "ymrc" || value === "ysrc";
}

export function getYmrcQuizBySlug(slug: string): ResearchQuizPaper | undefined {
  return YMRC_QUIZZES.find((q) => q.slug === slug);
}

export function getYmrcQuizSlugs(): string[] {
  return YMRC_QUIZZES.map((q) => q.slug);
}

export function getYsrcQuizBySlug(slug: string): ResearchQuizPaper | undefined {
  return YSRC_QUIZZES.find((q) => q.slug === slug);
}

export function getYsrcQuizSlugs(): string[] {
  return YSRC_QUIZZES.map((q) => q.slug);
}

export function getQuizByCompetition(competition: CompetitionId, slug: string): ResearchQuizPaper | undefined {
  return competition === "ymrc" ? getYmrcQuizBySlug(slug) : getYsrcQuizBySlug(slug);
}

export function getResearchQuizStaticParams(): { competition: CompetitionId; slug: string }[] {
  return [
    ...getYmrcQuizSlugs().map((slug) => ({ competition: "ymrc" as const, slug })),
    ...getYsrcQuizSlugs().map((slug) => ({ competition: "ysrc" as const, slug })),
  ];
}
