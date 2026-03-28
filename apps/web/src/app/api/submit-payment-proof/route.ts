import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as {
    course_id?: string;
    amount?: number;
    storage_path?: string;
  };

  const { course_id, amount, storage_path } = body;
  if (!course_id || !amount || !storage_path) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Generate 7-day signed URL so the admin can view the screenshot
  const { data: signedData } = await admin.storage
    .from("payment-proofs")
    .createSignedUrl(storage_path, 60 * 60 * 24 * 7);

  const screenshotUrl = signedData?.signedUrl ?? null;

  // Insert pending purchase
  const { error: dbError } = await admin.from("purchases").upsert(
    {
      user_id: user.id,
      course_id,
      amount,
      status: "pending",
      payment_method: "upi",
      screenshot_url: screenshotUrl,
    },
    { onConflict: "user_id,course_id" },
  );

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Fetch user profile + course details for the email
  const [profileRes, courseRes] = await Promise.all([
    admin.from("profiles").select("full_name, phone").eq("id", user.id).single(),
    admin.from("courses").select("title, price").eq("id", course_id).single(),
  ]);

  const studentName = profileRes.data?.full_name ?? "Unknown";
  const phone = profileRes.data?.phone ?? "—";
  const courseTitle = courseRes.data?.title ?? "Unknown course";
  const amountRupees = `₹${(amount / 100).toFixed(0)}`;

  // Send email notification — only if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: "Parikshanam <noreply@parikshanam.com>",
      to: "manasputra.paiko@gmail.com",
      subject: `New UPI Payment — ${courseTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1B3A6E">New UPI Payment Received</h2>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;color:#666;width:140px">Student</td><td style="padding:8px;font-weight:600">${studentName}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${user.email}</td></tr>
            <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">${phone}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Course</td><td style="padding:8px;font-weight:600">${courseTitle}</td></tr>
            <tr><td style="padding:8px;color:#666">Amount</td><td style="padding:8px;font-weight:600;color:#E8720C">${amountRupees}</td></tr>
          </table>
          ${screenshotUrl ? `
          <p style="margin:16px 0">
            <a href="${screenshotUrl}" style="background:#E8720C;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">
              View Payment Screenshot
            </a>
          </p>
          <p style="color:#999;font-size:12px">Screenshot link expires in 7 days.</p>
          ` : ""}
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#999;font-size:12px">
            Go to the <a href="${process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002"}/purchases" style="color:#E8720C">Admin Purchases page</a> to approve and enroll this student.
          </p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
