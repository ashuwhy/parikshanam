import Link from "next/link";
import { buttonProps } from "@/components/ui/buttonStyles";
import {
  Flame, BookOpen, CheckCircle,
  Calculator, FlaskConical, Globe, Laptop,
  Play, HelpCircle, FileDown,
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
        className="rounded-[var(--radius-card)] overflow-hidden"
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
    <section className="relative overflow-hidden bg-transparent pt-32 pb-28 md:pb-32 px-6 sm:px-8">
      {/* Translucent wash only - doodles come from root layout `DoodleBackground` (single layer, no duplicate). */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(232,114,12,0.11) 0%, transparent 72%), radial-gradient(ellipse 80% 60% at 0% 100%, rgba(27,58,110,0.06) 0%, transparent 68%), radial-gradient(ellipse 60% 50% at 100% 50%, rgba(27,138,122,0.04) 0%, transparent 62%), rgba(249,247,245,0.48)",
          }}
        />
        <div
          className="absolute top-20 right-[10%] h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(232,114,12,0.25) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-20 left-[5%] h-96 w-96 rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(27,58,110,0.20) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 xl:gap-20 items-center">
          {/* Left: copy */}
          <div>
            {/* Eyebrow badge - enhanced */}
            <div className="animate-fade-in-up inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-[#E8720C]/25 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_8px_24px_-8px_rgba(27,58,110,0.08)]">
              <Globe size={20} color="#E8720C" strokeWidth={2.5} className="shrink-0" aria-hidden />
              <span
                className="text-sm text-[#E8720C]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.01em" }}
              >
                Live
              </span>
            </div>

            <h1
              className="animate-fade-in-up delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5rem] leading-[1.08] sm:leading-[1.06] text-[#1B3A6E] mb-8 text-balance"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
            >
              Master every
              <br />
              <span className="relative inline-block text-[#E8720C]">
                Olympiad.
                <svg
                  className="absolute -bottom-2 left-1/2 h-3 w-[105%] max-w-[11rem] -translate-x-1/2 sm:max-w-[13rem]"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M4 10 Q100 2 196 10"
                    stroke="#F5C842"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                </svg>
              </span>
              <br />
              Ace every exam.
            </h1>

            <p
              className="animate-fade-in-up delay-2 text-lg sm:text-xl text-[#4B5563] leading-[1.65] max-w-xl mb-11"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
            >
              Expert-crafted courses for Grades 6–10. Watch video lessons, take interactive quizzes,
              and track your progress - all right here in the browser.
            </p>

            {/* CTAs - YSC beside main pair; md+ three equal columns */}
            <div className="animate-fade-in-up delay-3 mb-14 grid w-full max-w-lg grid-cols-1 gap-3 sm:gap-4 sm:max-w-2xl sm:grid-cols-2 md:max-w-5xl md:grid-cols-3">
              <Link
                href="/login"
                {...buttonProps(
                  "primaryHeroLg",
                  "w-full justify-center text-center px-4 sm:px-6 md:px-8",
                )}
              >
                Start Learning
              </Link>
              <Link
                href="/explore"
                {...buttonProps(
                  "outlineHero",
                  "w-full justify-center text-center bg-white/95 backdrop-blur-sm border-[#E5E0D8] px-4 py-3.5 text-sm sm:px-5 sm:py-4 sm:text-base md:py-5 md:text-[1.05rem]",
                )}
              >
                Browse Courses
              </Link>
              <Link
                href="/ysc"
                {...buttonProps(
                  "outlineHero",
                  "w-full justify-center gap-2 text-center sm:col-span-2 md:col-span-1 bg-white/95 backdrop-blur-sm border-[#1B8A7A]/45 text-[#1B3A6E] hover:border-[#1B8A7A] hover:text-[#1B8A7A] hover:bg-[#1B8A7A]/[0.06] px-4 py-3.5 text-sm sm:px-5 sm:py-4 sm:text-base md:py-5 md:text-[1.05rem]",
                )}
              >
                <FileDown
                  strokeWidth={2.25}
                  className="h-[18px] w-[18px] shrink-0 text-[#1B8A7A] sm:h-5 sm:w-5"
                  aria-hidden
                />
                YSC certificate
              </Link>
            </div>

            {/* Social proof - enhanced */}
            <div className="animate-fade-in-up delay-4 flex w-fit max-w-full mx-auto sm:mx-0 items-center gap-4 p-5 sm:p-6 rounded-[var(--radius-card)] bg-white/70 backdrop-blur-md border border-[#E5E0D8]/90 shadow-[0_1px_0_rgba(255,255,255,0.75)_inset,0_10px_32px_-12px_rgba(27,58,110,0.1)]">
              <div className="flex -space-x-3">
                {["A", "R", "S", "P"].map((l, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-[3px] border-white flex items-center justify-center text-white text-sm shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                    style={{ 
                      background: ["#E8720C", "#1B3A6E", "#1B8A7A", "#F5C842"][i],
                      fontFamily: "var(--font-nunito-var)",
                      fontWeight: 900
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <p
                  className="text-sm text-[#374151] leading-snug"
                  style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
                >
                  Join{" "}
                  <strong
                    className="text-[#E8720C]"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                  >
                    10,000+
                  </strong>{" "}
                  students
                </p>
                <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                  already learning
                </p>
              </div>
            </div>
          </div>

          {/* Right: browser mockup - hidden on mobile */}
          <div className="hidden lg:flex justify-end animate-fade-in-up delay-2">
            <BrowserMockup />
          </div>

          {/* Mobile-only visual: floating subject clouds */}
          <div className="flex lg:hidden justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {MINI_SUBJECTS.map(({ Icon, label, bg, border, color }, i) => (
                <div
                  key={label}
                  className={`animate-scale-in delay-${i + 2} flex items-center gap-3 p-4 rounded-[var(--radius-card)] border-2 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_6px_20px_-10px_rgba(27,58,110,0.08)] transition-[border-color,box-shadow] duration-200 ease-out hover:shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_28px_-10px_rgba(27,58,110,0.1)]`}
                  style={{ background: bg, borderColor: border }}
                >
                  <Icon size={22} color={color} strokeWidth={2.5} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#374151", fontFamily: "var(--font-nunito-var)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip - enhanced */}
        <div className="mt-20 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`animate-fade-in-up delay-${i + 1} flex flex-col items-center py-6 sm:py-7 px-4 sm:px-5 rounded-[var(--radius-card)] bg-white border border-[#E5E0D8] text-center shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_26px_-14px_rgba(27,58,110,0.07)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#E8720C]/45 hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_14px_36px_-12px_rgba(232,114,12,0.12)] cursor-default`}
            >
              <p
                className="text-2xl sm:text-3xl text-[#E8720C] mb-2 tabular-nums tracking-tight transition-colors duration-200 ease-out"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                {value}
              </p>
              <p
                className="text-[11px] sm:text-xs text-[#6B7280] uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
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
