import Image from "next/image";
import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] text-white py-16 px-6 sm:px-8 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" width={36} height={36} alt="Parikshanam" className="rounded-[var(--radius-icon-tile)]" />
            <h2
              className="text-xl text-white"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Parikshanam
            </h2>
          </div>
          <p
            className="text-[#9CA3AF] text-sm leading-[1.65] max-w-sm"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Empowering students in Grades 6–10 with expert Olympiad coaching.
            Video lessons, smart quizzes, and progress tracking - all in one app.
          </p>
          <p
            className="text-xs text-[#E8720C] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Learn smart. Compete hard. Win big.
          </p>
        </div>

        {/* Explore */}
        <div className="space-y-4">
          <h3
            className="text-sm uppercase tracking-widest text-[#E8720C]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Explore
          </h3>
          <nav className="flex flex-col gap-2.5">
            <a
              href="#features"
              className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Features
            </a>
            <a
              href="#subjects"
              className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Subjects
            </a>
            <a
              href="#courses"
              className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Courses
            </a>
            <a
              href="#download"
              className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Download App
            </a>
          </nav>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3
            className="text-sm uppercase tracking-widest text-[#E8720C]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Support
          </h3>
          <nav className="flex flex-col gap-2.5">
            <Link
              href="/terms"
              className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:hello@parikshanam.com"
              className="text-sm text-[#E5E7EB] hover:text-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Contact Us
            </a>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-[#6B7280]">
          &copy; {currentYear} Parikshanam. All rights reserved.
        </p>
        <div className="flex gap-6">
          <span className="text-xs text-[#4B5563] cursor-default">Instagram</span>
          <span className="text-xs text-[#4B5563] cursor-default">Twitter / X</span>
          <span className="text-xs text-[#4B5563] cursor-default">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}
