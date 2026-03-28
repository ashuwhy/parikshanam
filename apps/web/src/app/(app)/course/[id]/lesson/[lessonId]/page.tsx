import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonClient } from "./LessonClient";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [lessonRes, purchaseRes, progressRes] = await Promise.all([
    supabase.from("lessons").select("*").eq("id", lessonId).single(),
    supabase.from("purchases").select("id").eq("user_id", user.id).eq("course_id", courseId).eq("status", "completed").maybeSingle(),
    supabase.from("user_progress").select("id").eq("user_id", user.id).eq("lesson_id", lessonId).maybeSingle(),
  ]);

  if (lessonRes.error || !lessonRes.data) notFound();

  const lesson = lessonRes.data;
  const purchased = !!purchaseRes.data;
  const alreadyDone = !!progressRes.data;

  // Gate non-preview lessons
  if (!lesson.is_preview && !purchased) {
    redirect(`/course/${courseId}`);
  }

  return (
    <LessonClient
      lesson={lesson}
      courseId={courseId}
      userId={user.id}
      alreadyDone={alreadyDone}
    />
  );
}
