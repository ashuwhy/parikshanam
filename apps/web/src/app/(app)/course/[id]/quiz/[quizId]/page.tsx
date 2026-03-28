import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuizClient } from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id: courseId, quizId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [quizRes, purchaseRes, progressRes] = await Promise.all([
    supabase
      .from("quizzes")
      .select("*, quiz_questions(*)")
      .eq("id", quizId)
      .order("order_index", { referencedTable: "quiz_questions" })
      .single(),
    supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("status", "completed")
      .maybeSingle(),
    supabase
      .from("user_progress")
      .select("id, score")
      .eq("user_id", user.id)
      .eq("quiz_id", quizId)
      .maybeSingle(),
  ]);

  if (quizRes.error || !quizRes.data) notFound();
  if (!purchaseRes.data) redirect(`/course/${courseId}`);

  const quiz = quizRes.data;
  const questions = quiz.quiz_questions ?? [];
  const previousScore = progressRes.data?.score ?? null;

  return (
    <QuizClient
      quiz={{ ...quiz, quiz_questions: undefined }}
      questions={questions}
      courseId={courseId}
      userId={user.id}
      previousScore={previousScore}
    />
  );
}
