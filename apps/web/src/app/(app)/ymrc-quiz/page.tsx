import type { Metadata } from "next";

import YmrcQuizHubClient from "@/components/ymrc-quiz/YmrcQuizHubClient";
import { YMRC_QUIZZES } from "@/lib/ymrc-quiz";

export const metadata: Metadata = {
  title: "YMRC practice quiz - Parikshanam",
  description:
    "Free Young Mathematical Research Competition sample quiz — Class VII to XII. Sign in to practice.",
};

export default function YmrcQuizHubPage() {
  return <YmrcQuizHubClient quizzes={YMRC_QUIZZES} />;
}
