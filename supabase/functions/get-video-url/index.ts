import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour
const VIDEO_BUCKET = "course-videos";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Missing or invalid authorization" }, 401);
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
      return json({ error: "Missing bearer token" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser(token);
    if (userError || !user) {
      console.error("Auth error:", userError?.message);
      return json({ error: "Unauthorized", details: userError?.message }, 401);
    }

    // Parse request body
    const { lesson_id } = (await req.json()) as { lesson_id?: string };
    if (!lesson_id) {
      return json({ error: "lesson_id required" }, 400);
    }

    // Lookup lesson
    const { data: lesson, error: lessonError } = await userClient
      .from("lessons")
      .select("id, course_id, video_storage_path, is_preview")
      .eq("id", lesson_id)
      .maybeSingle();

    if (lessonError || !lesson) {
      console.error("Lesson not found:", lesson_id, lessonError);
      return json({ error: "Lesson not found" }, 404);
    }

    if (!lesson.video_storage_path) {
      return json({ error: "No video for this lesson" }, 404);
    }

    // Access: preview or completed purchase
    if (!lesson.is_preview) {
      const { data: purchase, error: purchaseError } = await userClient
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", lesson.course_id)
        .eq("status", "completed")
        .maybeSingle();

      if (purchaseError || !purchase) {
        console.warn("Purchase required for user:", user.id, "course:", lesson.course_id);
        return json({ error: "Purchase required" }, 403);
      }
    }

    // Signed URL via service role (storage)
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
    console.error("Unexpected error:", e);
    return json({ error: "Internal Server Error" }, 500);
  }
});
