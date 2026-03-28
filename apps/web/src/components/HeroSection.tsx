import Link from "next/link";
import { buttonProps } from "@/components/ui/buttonStyles";
import {
  Flame, BookOpen, CheckCircle,
  Calculator, FlaskConical, Globe, Laptop,
  Play, HelpCircle,
} from "lucide-react";

const STATS = [
  { value: "10,000+", label: "Active Students" },
  { value: "Grades 6–10", label: "Curriculum-Aligned" },
  { value: "4 Subjects", label: "Math, Science & More" },
  { value: "Pan-India", label: "All Major Boards" },
];

const MINI_SUBJECTS = [
  { Icon: Calculator, label: "Math", bg: "#EFF6FF", border: "#BFDBFE", color: "#3B82F6" },
  { Icon: FlaskConical, label: "Science", bg: "#F0FDF4", border: "#BBF7D0", color: "#22C55E" },
  { Icon: Globe, label: "Geography", bg: "#FFFBEB", border: "#FDE68A", color: "#F59E0B" },
  { Icon: Laptop, label: "Computing", bg: "#F5F3FF", border: "#DDD6FE", color: "#8B5CF6" },
];

function BrowserMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-[480px]"
      style={{ filter: "drop-shadow(0 32px 56px rgba(27,58,110,0.20))" }}
    >
      {/* Browser chrome */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #E5E0D8", background: "#F3F4F6" }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#F3F4F6", borderBottom: "1px solid #E5E0D8" }}>
          <div className="flex gap-1.5">
            {["#F87171", "#FBBF24", "#34D399"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />
            ))}
          </div>
          <div
            className="flex-1 mx-3 flex items-center px-3 rounded-md"
            style={{ background: "white", border: "1px solid #E5E0D8", height: 22 }}
          >
            <span style={{ fontSize: 9, color: "#9CA3AF", fontFamily: "monospace" }}>
              parikshanam.com/dashboard
            </span>
          </div>
        </div>

        {/* App content */}
        <div style={{ background: "#F9F7F5", padding: "14px 14px 16px", display: "flex", gap: 12 }}>
          {/* Sidebar */}
          <div
            style={{
              width: 44,
              background: "white",
              borderRadius: 12,
              border: "1px solid #E5E0D8",
              padding: "10px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {[
              { Icon: BookOpen, active: false },
              { Icon: Flame, active: true },
              { Icon: HelpCircle, active: false },
            ].map(({ Icon, active }, i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: active ? "#E8720C" : "transparent",
                }}
              >
                <Icon size={14} color={active ? "white" : "#9CA3AF"} strokeWidth={2.5} />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Greeting */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <p style={{ fontSize: 11, fontWeight: 900, color: "#111827", fontFamily: "var(--font-nunito-var)" }}>
                  Good morning, Aryan!
                </p>
                <p style={{ fontSize: 8, color: "#9CA3AF", fontFamily: "var(--font-roboto-var)", marginTop: 1 }}>
                  Ready for today&apos;s lesson?
                </p>
              </div>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: "#1B3A6E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 10, color: "white", fontWeight: 900, fontFamily: "var(--font-nunito-var)" }}>A</span>
              </div>
            </div>

            {/* Stats chips */}
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {[
                { val: "3", sub: "COURSES", bg: "white" },
                { val: "24", sub: "LESSONS", bg: "white" },
                { val: "7", sub: "STREAK", bg: "#E8720C", textColor: "white" },
              ].map((s) => (
                <div
                  key={s.sub}
                  style={{
                    flex: 1,
                    background: s.bg,
                    border: s.bg === "white" ? "1px solid #E5E0D8" : "none",
                    borderRadius: 10,
                    padding: "5px 0",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 900, color: s.textColor ?? "#E8720C", fontFamily: "var(--font-nunito-var)", lineHeight: 1 }}>
                    {s.val}
                  </p>
                  <p style={{ fontSize: 6, color: s.textColor ? "rgba(255,255,255,0.8)" : "#9CA3AF", letterSpacing: "0.07em", marginTop: 2, fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Course card */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E5E0D8", overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: 52, background: "linear-gradient(135deg, rgba(232,114,12,0.12) 0%, rgba(27,58,110,0.07) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <BookOpen size={18} color="#E8720C" strokeWidth={1.5} />
                <div style={{ position: "absolute", top: 5, left: 6, background: "#1B3A6E", borderRadius: 5, padding: "2px 5px" }}>
                  <span style={{ fontSize: 7, color: "white", fontWeight: 700 }}>Science Olympiad</span>
                </div>
                <div style={{ position: "absolute", top: 5, right: 6, background: "rgba(255,255,255,0.92)", borderRadius: 5, padding: "2px 5px", display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircle size={7} color="#22C55E" strokeWidth={2.5} />
                  <span style={{ fontSize: 7, color: "#22C55E", fontWeight: 700 }}>Enrolled</span>
                </div>
              </div>
              <div style={{ padding: "7px 9px 9px" }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: "#111827", fontFamily: "var(--font-nunito-var)", marginBottom: 4 }}>
                  Class 8 Science Olympiad Complete
                </p>
                {/* Progress */}
                <div style={{ height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ width: "62%", height: "100%", background: "#E8720C", borderRadius: 2 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 7, color: "#9CA3AF", fontFamily: "var(--font-roboto-var)" }}>26 of 42 lessons</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, background: "#E8720C", borderRadius: 6, padding: "2px 7px" }}>
                    <Play size={6} color="white" fill="white" strokeWidth={0} />
                    <span style={{ fontSize: 7, color: "white", fontWeight: 800, fontFamily: "var(--font-nunito-var)" }}>Resume</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {MINI_SUBJECTS.map(({ Icon, label, bg, border, color }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 3, background: bg, border: `1px solid ${border}`, borderRadius: 7, padding: "2px 6px" }}
                >
                  <Icon size={8} color={color} strokeWidth={2.2} />
                  <span style={{ fontSize: 7, fontWeight: 700, color: "#374151", fontFamily: "var(--font-roboto-var)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="pt-28 pb-16 px-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 60% at 60% -5%, rgba(232,114,12,0.10) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 0% 80%, rgba(27,58,110,0.06) 0%, transparent 60%), #F9F7F5",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: copy */}
          <div>
            {/* Eyebrow badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#E8720C]/10 border border-[#E8720C]/20">
              <Globe size={18} color="#E8720C" strokeWidth={2.2} className="shrink-0" aria-hidden />
              <span
                className="text-xs sm:text-sm text-[#E8720C]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Learn in your browser — no download needed
              </span>
            </div>

            <h1
              className="animate-fade-in-up delay-1 text-3xl sm:text-5xl lg:text-[4rem] leading-tight text-[#1B3A6E] mb-5"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Master every
              <br />
              <span className="text-[#E8720C]">Olympiad.</span>
              <br />
              Ace every exam.
            </h1>

            <p
              className="animate-fade-in-up delay-2 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-lg mb-8"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
            >
              Expert-crafted courses for Grades 6–10. Watch video lessons, take interactive quizzes,
              and track your progress — all right here in the browser.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-3 flex flex-wrap gap-3 sm:gap-4 mb-12">
              <Link href="/login" {...buttonProps("primaryHero")}>
                Start Learning Free →
              </Link>
              <Link href="/explore" {...buttonProps("outlineHero")}>
                Browse Courses
              </Link>
            </div>

            {/* Social proof */}
            <div className="animate-fade-in-up delay-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "R", "S", "P"].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#F9F7F5] flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: ["#E8720C", "#1B3A6E", "#1B8A7A", "#F5C842"][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p
                className="text-xs sm:text-sm text-[#6B7280]"
                style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
              >
                Join{" "}
                <strong
                  className="text-[#E8720C]"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  10,000+
                </strong>{" "}
                students already learning
              </p>
            </div>
          </div>

          {/* Right: browser mockup — hidden on mobile */}
          <div className="hidden lg:flex justify-end">
            <BrowserMockup />
          </div>

          {/* Mobile-only visual: floating subject clouds */}
          <div className="flex lg:hidden justify-center">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {MINI_SUBJECTS.map(({ Icon, label, bg, border, color }, i) => (
                <div
                  key={label}
                  className={`animate-scale-in delay-${i + 2} flex items-center gap-2.5 p-3 rounded-2xl border`}
                  style={{ background: bg, borderColor: border }}
                >
                  <Icon size={18} color={color} strokeWidth={2.2} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", fontFamily: "var(--font-nunito-var)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`animate-fade-in-up delay-${i + 1} flex flex-col items-center py-4 sm:py-5 px-3 sm:px-4 rounded-2xl bg-white border border-[#E5E0D8] text-center hover:border-[#E8720C]/40 hover:-translate-y-0.5 transition-all`}
            >
              <p
                className="text-xl sm:text-2xl text-[#E8720C] mb-1"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                {value}
              </p>
              <p
                className="text-[10px] sm:text-xs text-[#9CA3AF] uppercase tracking-widest"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
