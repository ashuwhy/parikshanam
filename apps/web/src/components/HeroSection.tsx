import Image from "next/image";
import { Flame, Star, BookOpen, CheckCircle, Calculator, FlaskConical, Globe, Laptop } from "lucide-react";

const STATS = [
  { value: "10,000+", label: "Active Students" },
  { value: "Grades 6–10", label: "Curriculum-Aligned" },
  { value: "4 Subjects", label: "Math, Science & More" },
  { value: "Pan-India", label: "All Major Boards" },
];

// Mini subject pills for the phone mockup
const MINI_SUBJECTS = [
  { Icon: Calculator, label: "Math", bg: "#EFF6FF", border: "#BFDBFE", color: "#3B82F6" },
  { Icon: FlaskConical, label: "Science", bg: "#F0FDF4", border: "#BBF7D0", color: "#22C55E" },
  { Icon: Globe, label: "Geography", bg: "#FFFBEB", border: "#FDE68A", color: "#F59E0B" },
  { Icon: Laptop, label: "Computing", bg: "#F5F3FF", border: "#DDD6FE", color: "#8B5CF6" },
];

function PhoneMockup() {
  return (
    <div
      className="relative mx-auto"
      style={{ width: 260, filter: "drop-shadow(0 32px 48px rgba(27,58,110,0.22))" }}
    >
      {/* Phone outer shell */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 260,
          borderRadius: 40,
          border: "8px solid #1B3A6E",
          background: "#F9F7F5",
        }}
      >
        {/* Dynamic Island / notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 80, height: 20, borderRadius: 10, background: "#0a0a12" }} />
        </div>

        {/* App content */}
        <div style={{ padding: "10px 14px 20px" }}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#111827",
                  fontFamily: "var(--font-nunito-var)",
                  lineHeight: 1.2,
                }}
              >
                Good morning, Alex!
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: "#6B7280",
                  fontFamily: "var(--font-roboto-var)",
                  marginTop: 1,
                }}
              >
                Ready to ace your Olympiad?
              </p>
            </div>
            {/* Avatar */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: "#E8720C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 11, color: "white", fontWeight: 800 }}>A</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-2 mb-3">
            {[
              { val: "3", sub: "COURSES" },
              { val: "12", sub: "LESSONS" },
            ].map((s) => (
              <div
                key={s.sub}
                style={{
                  flex: 1,
                  background: "white",
                  border: "1px solid #E5E0D8",
                  borderRadius: 12,
                  padding: "6px 0",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    color: "#E8720C",
                    fontFamily: "var(--font-nunito-var)",
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </p>
                <p
                  style={{
                    fontSize: 7,
                    color: "#9CA3AF",
                    letterSpacing: "0.08em",
                    marginTop: 2,
                    fontFamily: "var(--font-nunito-var)",
                    fontWeight: 700,
                  }}
                >
                  {s.sub}
                </p>
              </div>
            ))}
            {/* Flame tile */}
            <div
              style={{
                flex: 1,
                background: "#E8720C",
                borderRadius: 12,
                padding: "6px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame size={14} color="white" strokeWidth={2} />
              <p
                style={{
                  fontSize: 7,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 2,
                  fontFamily: "var(--font-nunito-var)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                STREAK
              </p>
            </div>
          </div>

          {/* Featured label */}
          <div className="flex items-center gap-1 mb-2">
            <Star size={9} color="#E8720C" strokeWidth={2.5} fill="#E8720C" />
            <p
              style={{
                fontSize: 8,
                fontWeight: 800,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "var(--font-nunito-var)",
              }}
            >
              Featured
            </p>
          </div>

          {/* Course card */}
          <div
            style={{
              background: "white",
              borderRadius: 14,
              border: "1px solid #E5E0D8",
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                height: 68,
                background: "linear-gradient(135deg, #E8720C20 0%, #1B3A6E12 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <BookOpen size={22} color="#E8720C" strokeWidth={1.5} />
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  background: "#1B3A6E",
                  borderRadius: 6,
                  padding: "2px 5px",
                }}
              >
                <span style={{ fontSize: 7, color: "white", fontWeight: 700 }}>Science Olympiad</span>
              </div>
              {/* Enrolled badge */}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(255,255,255,0.92)",
                  borderRadius: 6,
                  padding: "2px 5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CheckCircle size={7} color="#22C55E" strokeWidth={2.5} />
                <span style={{ fontSize: 7, color: "#22C55E", fontWeight: 700 }}>Enrolled</span>
              </div>
            </div>
            {/* Card body */}
            <div style={{ padding: "8px 10px 10px" }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.3,
                  fontFamily: "var(--font-nunito-var)",
                  marginBottom: 5,
                }}
              >
                Class 8 Science Olympiad Complete
              </p>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: "#E8720C",
                    fontFamily: "var(--font-nunito-var)",
                  }}
                >
                  ₹999
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: "#9CA3AF",
                    textDecoration: "line-through",
                    fontFamily: "var(--font-roboto-var)",
                  }}
                >
                  ₹1,499
                </span>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 900,
                    color: "#16A34A",
                    fontFamily: "var(--font-nunito-var)",
                  }}
                >
                  -33%
                </span>
              </div>
            </div>
          </div>

          {/* Browse topics */}
          <p
            style={{
              fontSize: 8,
              fontWeight: 800,
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 6,
              fontFamily: "var(--font-nunito-var)",
            }}
          >
            Browse Topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {MINI_SUBJECTS.map(({ Icon, label, bg, border, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 8,
                  padding: "3px 6px",
                }}
              >
                <Icon size={9} color={color} strokeWidth={2.2} />
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "var(--font-roboto-var)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2.5">
          <div style={{ width: 60, height: 4, borderRadius: 2, background: "#1B3A6E40" }} />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          {/* Left: copy */}
          <div>
            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#E8720C]/10 border border-[#E8720C]/20"
            >
              <span className="text-lg">🎉</span>
              <span
                className="text-sm text-[#E8720C]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Now available on iOS &amp; Android
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-[4rem] leading-tight text-[#1B3A6E] mb-5"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Master every
              <br />
              <span className="text-[#E8720C]">Olympiad.</span>
              <br />
              Ace every exam.
            </h1>

            <p
              className="text-lg text-[#6B7280] leading-relaxed max-w-lg mb-8"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
            >
              Expert-crafted courses for Grades 6–10. Video lessons, interactive quizzes,
              progress tracking — everything a student needs to compete and win.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#E8720C] text-white text-base border-b-4 border-[#A04F08] hover:bg-[#d4640a] hover:translate-y-[1px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 transition-all select-none cursor-pointer"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Download Free
              </a>
              <a
                href="#courses"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-[#1B3A6E] text-base border-2 border-[#E5E0D8] hover:border-[#E8720C] hover:text-[#E8720C] transition-colors select-none cursor-pointer"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                Browse Courses →
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "R", "S", "P"].map((l, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#F9F7F5] flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: ["#E8720C", "#1B3A6E", "#1B8A7A", "#F5C842"][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p
                className="text-sm text-[#6B7280]"
                style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
              >
                Join <strong className="text-[#E8720C]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>10,000+</strong> students already learning
              </p>
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center py-5 px-4 rounded-2xl bg-white border border-[#E5E0D8] text-center"
            >
              <p
                className="text-2xl text-[#E8720C] mb-1"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                {value}
              </p>
              <p
                className="text-xs text-[#9CA3AF] uppercase tracking-widest"
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
