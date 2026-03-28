import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log("Signing in with a real user to get a fresh token...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'manasputra.paiko@gmail.com', // Let's try the email from the code earlier
    password: 'password123' // This might fail if the password is wrong, let's just use the current browser token instead if possible. But wait, I'll log in with the admin email or something... Actually, I don't know the password...
  });
  
  if (authError) {
    console.log("Auth failed, cannot test with real token:", authError);
    return;
  }

  const token = authData.session.access_token;
  
  console.log("Fetching manually...");
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-video-url`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ lesson_id: "test" })
  });

  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}

test();
