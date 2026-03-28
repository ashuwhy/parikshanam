import { Video, Brain, TrendingUp, Trophy, Zap, BookMarked } from "lucide-react";

const FEATURES = [
  {
    Icon: Video,
    iconBg: "#FFF7ED",
    iconColor: "#E8720C",
    title: "Expert Video Lessons",
    description:
      "Crystal-clear, structured video content from subject experts. Watch at your own pace, rewind, and revisit lessons anytime.",
    tag: "Core Learning",
    tagColor: "#E8720C",
  },
  {
    Icon: Brain,
    iconBg: "#F0FDF4",
    iconColor: "#22C55E",
    title: "Smart Quizzes",
    description:
      "Chapter-end quizzes with instant feedback, answer explanations, and detailed score breakdowns that show exactly where to improve.",
    tag: "Practice & Test",
    tagColor: "#22C55E",
  },
  {
    Icon: TrendingUp,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "Progress Tracking",
    description:
      "See which lessons you've completed, your quiz scores, and streaks - all in a beautiful dashboard that keeps you motivated.",
    tag: "Stay on Track",
    tagColor: "#3B82F6",
  },
  {
    Icon: Trophy,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
    title: "Olympiad Ready",
    description:
      "Courses built specifically for national Olympiads - Science, Math, Geography, and Computing - with syllabus-aligned content.",
    tag: "Compete & Win",
    tagColor: "#F59E0B",
  },
  {
    Icon: BookMarked,
    iconBg: "#F5F3FF",
    iconColor: "#8B5CF6",
    title: "Full Syllabus Coverage",
    description:
      "Every module, every topic, every chapter - neatly organized so nothing slips through the cracks before exam day.",
    tag: "Complete Coverage",
    tagColor: "#8B5CF6",
  },
  {
    Icon: Zap,
    iconBg: "#F0FDFA",
    iconColor: "#1B8A7A",
    title: "Learn Anywhere",
    description:
      "Native mobile app for iOS and Android. Content loads fast, works great on any screen, anytime - even with limited connectivity.",
    tag: "Mobile-First",
    tagColor: "#1B8A7A",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 px-6 sm:px-8 bg-white border-t border-[#E5E0D8]/90 overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle, #1B3A6E 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16 animate-fade-in-up">
          <p
            className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#C65F0A] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Features
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-[2.75rem] md:leading-tight text-[#1B3A6E] mb-5 text-balance max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
          >
            Everything a student needs to excel
          </h2>
          <p
            className="text-[#4B5563] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
          >
            Parikshanam packs a full learning system into one beautifully simple app.
          </p>
        </div>

        {/* Feature grid - enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map(({ Icon, iconBg, iconColor, title, description, tag, tagColor }, i) => (
            <div
              key={title}
              className={`animate-fade-in-up delay-${Math.min(i + 1, 6)} group flex flex-col p-7 sm:p-8 rounded-[var(--radius-card)] border border-[#E5E0D8] bg-[#FAF8F6] shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_10px_36px_-18px_rgba(27,58,110,0.08)] transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-[#E8720C]/40 hover:bg-white hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_18px_44px_-14px_rgba(232,114,12,0.12)] cursor-default`}
            >
              {/* Icon - enhanced */}
              <div
                className="w-14 h-14 rounded-[var(--radius-nested)] flex items-center justify-center mb-6 border transition-[box-shadow,border-color] duration-200 ease-out shadow-[0_2px_8px_-2px_rgba(27,58,110,0.08)] group-hover:shadow-[0_6px_16px_-4px_rgba(27,58,110,0.12)]"
                style={{
                  background: iconBg,
                  borderColor: iconColor + "55",
                }}
              >
                <Icon size={26} color={iconColor} strokeWidth={2.2} />
              </div>

              {/* Tag - enhanced */}
              <span
                className="inline-block self-start mb-4 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.12em] border"
                style={{
                  background: tagColor + "12",
                  borderColor: tagColor + "28",
                  color: tagColor,
                  fontFamily: "var(--font-nunito-var)",
                  fontWeight: 900,
                }}
              >
                {tag}
              </span>

              <h3
                className="text-lg sm:text-xl text-[#111827] mb-3 group-hover:text-[#E8720C] transition-colors duration-200"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.015em" }}
              >
                {title}
              </h3>
              <p
                className="text-sm text-[#6B7280] leading-[1.65]"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
