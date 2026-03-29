import type { Metadata } from "next";

import { ResearchQuizHub } from "@/components/research-quiz/ResearchQuizHub";

export const metadata: Metadata = {
  title: "Free practice quizzes (YMRC & YSRC) - Parikshanam",
  description:
    "Young Mathematical Research Challenge (mathematics) and Young Scientific Research Challenge (science) sample quizzes. Sign in to practice.",
};

export default function ResearchQuizPage() {
  return <ResearchQuizHub />;
}
