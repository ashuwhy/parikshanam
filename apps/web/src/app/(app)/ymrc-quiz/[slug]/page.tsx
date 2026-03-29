import type { Metadata } from "next";
import { notFound } from "next/navigation";

import YmrcQuizPlayerClient from "@/components/ymrc-quiz/YmrcQuizPlayerClient";
import { getYmrcQuizBySlug, getYmrcQuizSlugs } from "@/lib/ymrc-quiz";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getYmrcQuizSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const quiz = getYmrcQuizBySlug(slug);
  if (!quiz) return { title: "Quiz not found" };
  return {
    title: `${quiz.label} YMRC quiz - Parikshanam`,
    description: `${quiz.subtitle} — 25 practice questions.`,
  };
}

export default async function YmrcQuizSlugPage({ params }: Props) {
  const { slug } = await params;
  const quiz = getYmrcQuizBySlug(slug);
  if (!quiz) notFound();

  return <YmrcQuizPlayerClient quiz={quiz} />;
}
