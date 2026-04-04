"use client";

import Link from "next/link";
import { useState } from "react";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Account Deletion Request");
    const body = encodeURIComponent(
      `Hi,\n\nI would like to request deletion of my Parikshanam account and all associated data.\n\nRegistered email: ${email}\n\nPlease confirm once my account has been deleted.\n\nThank you.`
    );
    window.location.href = `mailto:support@parikshanam.in?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(232,114,12,0.07) 0%, transparent 70%)",
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
            Account
          </p>
          <h1
            className="text-4xl sm:text-5xl text-white tracking-tight mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Delete Account
          </h1>
          <p
            className="text-[#9CA3AF] text-sm"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            We&apos;ll process your request within 30 days.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p
          className="text-[#4B5563] leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-roboto-var)" }}
        >
          You can request permanent deletion of your Parikshanam account and all associated
          data. Once deleted, this action cannot be undone.
        </p>

        {/* What gets deleted */}
        <div className="mb-10">
          <h2
            className="text-lg text-[#1B3A6E] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            What will be deleted
          </h2>
          <ul
            className="space-y-2 text-sm text-[#4B5563]"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            {[
              "Your account profile (name, email, phone, class level)",
              "Your course enrolments and purchase history",
              "Your lesson progress and quiz scores",
              "Any other personal data associated with your account",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-[#E8720C]">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What is retained */}
        <div className="mb-10">
          <h2
            className="text-lg text-[#1B3A6E] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            What may be retained
          </h2>
          <p
            className="text-sm text-[#4B5563] leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Certain records such as transaction data may be retained for a limited period as
            required by law or for accounting purposes. These records will not be used for
            any marketing or personalisation purposes.
          </p>
        </div>

        {/* Request form */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8">
          <h2
            className="text-lg text-[#1B3A6E] mb-2"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Submit a deletion request
          </h2>
          <p
            className="text-sm text-[#6B7280] mb-6"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Enter the email address associated with your account. This will open your email
            client with a pre-filled request.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-[600] uppercase tracking-wider text-[#6B7280] mb-1.5"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                Account email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#1B3A6E] focus:ring-2 focus:ring-[#1B3A6E]/10 transition"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 text-sm font-[700] transition-colors"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Request account deletion
            </button>
          </form>

          <p
            className="mt-4 text-xs text-[#9CA3AF] leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Alternatively, email us directly at{" "}
            <a
              href="mailto:support@parikshanam.in"
              className="text-[#E8720C] hover:underline"
            >
              support@parikshanam.in
            </a>{" "}
            with the subject &quot;Account Deletion Request&quot;.
          </p>
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
