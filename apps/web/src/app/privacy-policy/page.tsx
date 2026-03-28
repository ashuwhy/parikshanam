import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Parikshanam",
  description: "How Parikshanam collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly when you create an account, enrol in a course, or contact us. This includes your name, email address, phone number, and class level. We also collect usage data such as lessons viewed, quiz scores, and session timestamps to personalise your learning experience.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to deliver and improve our services, process payments, send course-related notifications, and ensure platform security. We do not sell your personal data to third parties. Aggregated, anonymised analytics may be used to understand platform usage and improve content quality.`,
  },
  {
    title: "3. Payment Information",
    body: `Payments are processed by Razorpay, a PCI-DSS-compliant payment gateway. Parikshanam does not store your card details. By making a purchase, you also agree to Razorpay's terms and privacy policy.`,
  },
  {
    title: "4. Cookies and Tracking",
    body: `We use essential cookies to maintain your login session. We may use analytics tools to understand how users navigate the platform. You can disable cookies in your browser settings; however, some features may not function correctly without them.`,
  },
  {
    title: "5. Data Retention",
    body: `Your account data is retained for as long as your account is active. You may request deletion of your account and associated data by contacting us at privacy@parikshanam.com. Certain records may be retained for legal or accounting purposes.`,
  },
  {
    title: "6. Children's Privacy",
    body: `Parikshanam is designed for students in Grades 6–10. Students under 18 should use the platform with parental awareness. We do not knowingly collect data from children under 13 without verifiable parental consent.`,
  },
  {
    title: "7. Data Security",
    body: `We implement industry-standard security measures including encrypted data transmission (TLS), access controls, and regular security reviews. Despite our best efforts, no online service is 100% secure; we encourage you to use a strong, unique password.`,
  },
  {
    title: "8. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice. Continued use of the platform after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact Us",
    body: `If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at privacy@parikshanam.com or write to Parikshanam, India.`,
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p
            className="text-[#9CA3AF] text-sm"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Last updated: March 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p
          className="text-[#4B5563] leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-roboto-var)" }}
        >
          At Parikshanam, your privacy matters. This policy explains how we collect, use,
          and safeguard your information when you use our platform.
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
            href="/terms"
            className="text-sm font-[600] text-[#E8720C] hover:underline"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Terms &amp; Conditions →
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
