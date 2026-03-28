const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/admin/.env.local' });
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await admin.from('purchases').select('*, profile:profiles(full_name), course:courses(title)').order('created_at', { ascending: false });
  console.log("Error:", error);
  console.log("Data length:", data ? data.length : 0);
  if(data && data.length) console.log(data[0]);
}
run();
