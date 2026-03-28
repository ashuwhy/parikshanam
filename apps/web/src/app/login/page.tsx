import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign In — Parikshanam",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,114,12,0.09) 0%, transparent 70%), #F9F7F5",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/icon.png"
            width={72}
            height={72}
            alt="Parikshanam"
            className="rounded-2xl mb-4"
          />
          <h1
            className="text-3xl text-[#1B3A6E] tracking-tight"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Parikshanam
          </h1>
          <p
            className="mt-1 text-sm text-[#6B7280] text-center"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Sign in to continue learning
          </p>
        </div>

        {/* Sign-in card */}
        <div className="bg-white rounded-[2rem] border border-[#E5E0D8] p-8 shadow-sm">
          <h2
            className="text-xl text-[#111827] mb-2"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Welcome back
          </h2>
          <p
            className="text-sm text-[#6B7280] mb-8"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Continue to your courses and keep your streak alive.
          </p>

          <GoogleSignInButton />

          <p
            className="mt-6 text-xs text-[#9CA3AF] text-center leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-[#6B7280] underline">
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link href="/privacy-policy" className="text-[#6B7280] underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#E8720C] transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
