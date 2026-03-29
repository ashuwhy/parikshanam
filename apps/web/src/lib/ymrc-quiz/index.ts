import raw from "./quiz-data.json";
import type { YmrcQuizDataFile, YmrcQuizSet } from "./types";

const data = raw as YmrcQuizDataFile;

export const YMRC_QUIZZES: YmrcQuizSet[] = data.quizzes;

export function getYmrcQuizBySlug(slug: string): YmrcQuizSet | undefined {
  return YMRC_QUIZZES.find((q) => q.slug === slug);
}

export function getYmrcQuizSlugs(): string[] {
  return YMRC_QUIZZES.map((q) => q.slug);
}
