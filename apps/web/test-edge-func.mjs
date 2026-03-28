import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.functions.invoke("get-video-url", {
    body: { lesson_id: "test" }
  });
  console.log("Data:", data);
  console.error("Error payload:", JSON.stringify(error, null, 2));
}

test();
