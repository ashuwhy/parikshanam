import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Parikshanam",
  description: "Terms and conditions governing your use of the Parikshanam platform.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By creating an account or using the Parikshanam platform (the "Service"), you agree to be bound by these Terms and Conditions. If you are under 18, you confirm that a parent or guardian has reviewed and agreed to these terms on your behalf.`,
  },
  {
    title: "2. Use of the Platform",
    body: `Parikshanam grants you a limited, non-exclusive, non-transferable licence to access and use the Service for your personal, non-commercial educational purposes. You agree not to share your account credentials, copy or redistribute course content, or attempt to reverse-engineer any part of the platform.`,
  },
  {
    title: "3. Accounts and Registration",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Please notify us immediately at support@parikshanam.com if you suspect unauthorised access to your account.`,
  },
  {
    title: "4. Course Enrolment and Payments",
    body: `Courses are available for purchase at the prices listed on the platform. All prices are in Indian Rupees (INR) and inclusive of applicable taxes. Payments are processed securely via Razorpay. Once a course is purchased and access has been granted, refunds are issued at our discretion and subject to our Refund Policy.`,
  },
  {
    title: "5. Refund Policy",
    body: `You may request a refund within 7 days of purchase, provided you have not completed more than 20% of the course content. Refund requests after this window will not be entertained. To request a refund, contact support@parikshanam.com with your order details.`,
  },
  {
    title: "6. Intellectual Property",
    body: `All content on Parikshanam — including videos, quizzes, text, graphics, and branding — is the intellectual property of Parikshanam or its licensors. You may not reproduce, distribute, or create derivative works from our content without prior written permission.`,
  },
  {
    title: "7. User Conduct",
    body: `You agree to use the platform lawfully and respectfully. Prohibited conduct includes attempting to gain unauthorised access, uploading harmful or offensive content, impersonating others, or engaging in any activity that disrupts platform operations.`,
  },
  {
    title: "8. Disclaimer of Warranties",
    body: `The Service is provided on an "as is" and "as available" basis. While we strive for accuracy and quality, Parikshanam makes no warranties regarding the completeness, reliability, or fitness of the content for any particular purpose. Educational outcomes depend on the learner's effort and individual circumstances.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `To the maximum extent permitted by applicable law, Parikshanam shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability to you shall not exceed the amount you paid for the specific course giving rise to the claim.`,
  },
  {
    title: "10. Governing Law",
    body: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.`,
  },
  {
    title: "11. Changes to These Terms",
    body: `We reserve the right to update these Terms at any time. We will notify you of material changes via email or an in-app notification. Your continued use of the Service after such notice constitutes acceptance of the revised Terms.`,
  },
  {
    title: "12. Contact",
    body: `For questions about these Terms, please reach out to legal@parikshanam.com or write to Parikshanam, India.`,
  },
];

export default function TermsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(232,114,12,0.07) 0%, transparent 70%), #F9F7F5",
      }}
    >
      {/* Header */}
      <div className="bg-[#1B3A6E] text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-8 text-sm text-[#9CA3AF] hover:text-[#E8720C] transition-colors"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            ← Back to Home
          </Link>
          <p
            className="text-xs uppercase tracking-widest text-[#E8720C] mb-3"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Legal
          </p>
          <h1
            className="text-4xl sm:text-5xl text-white tracking-tight mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Terms &amp; Conditions
          </h1>
          <p
            className="text-[#9CA3AF] text-sm"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Last updated: March 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p
          className="text-[#4B5563] leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-roboto-var)" }}
        >
          Please read these Terms and Conditions carefully before using the Parikshanam
          platform. By accessing or using our Service, you agree to be bound by these terms.
        </p>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2
                className="text-lg text-[#1B3A6E] mb-2"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                {s.title}
              </h2>
              <p
                className="text-[#4B5563] leading-relaxed text-sm"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[#E5E7EB] flex gap-4 flex-wrap">
          <Link
            href="/privacy-policy"
            className="text-sm font-[600] text-[#E8720C] hover:underline"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Privacy Policy →
          </Link>
          <Link
            href="/"
            className="text-sm text-[#6B7280] hover:text-[#1B3A6E] transition-colors"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
