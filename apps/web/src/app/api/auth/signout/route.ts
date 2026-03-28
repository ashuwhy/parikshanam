import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Clears Supabase auth cookies on the server (pairs with client signOut).
 * POST only - avoids accidental GET prefetch logging users out.
 */
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
