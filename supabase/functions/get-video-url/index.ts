import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour
const VIDEO_BUCKET = "course-videos";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // ── 1. Verify auth ───────────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    // User client — scoped to the caller's permissions
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    // ── 2. Parse request ─────────────────────────────────────────────────────
    const body = (await req.json()) as { lesson_id?: string };
    if (!body.lesson_id) return json({ error: "lesson_id required" }, 400);

    // ── 3. Look up lesson + course ───────────────────────────────────────────
    const { data: lesson, error: lessonError } = await userClient
      .from("lessons")
      .select("id, course_id, video_storage_path, is_preview")
      .eq("id", body.lesson_id)
      .maybeSingle();

    if (lessonError || !lesson) return json({ error: "Lesson not found" }, 404);
    if (!lesson.video_storage_path) return json({ error: "No video for this lesson" }, 404);

    // ── 4. Gate: preview lessons are free; others require a purchase ─────────
    if (!lesson.is_preview) {
      const { data: purchase } = await userClient
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", lesson.course_id)
        .eq("status", "completed")
        .maybeSingle();

      if (!purchase) return json({ error: "Purchase required" }, 403);
    }

    // ── 5. Generate signed URL (service role only) ───────────────────────────
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: signed, error: signError } = await adminClient.storage
      .from(VIDEO_BUCKET)
      .createSignedUrl(lesson.video_storage_path, SIGNED_URL_EXPIRY_SECONDS);

    if (signError || !signed?.signedUrl) {
      console.error("Storage sign error:", signError);
      return json({ error: "Could not generate video URL" }, 500);
    }

    const expiresAt = new Date(Date.now() + SIGNED_URL_EXPIRY_SECONDS * 1000).toISOString();

    return json({ signed_url: signed.signedUrl, expires_at: expiresAt });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});
