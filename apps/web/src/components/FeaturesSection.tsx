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
      "See which lessons you've completed, your quiz scores, and streaks — all in a beautiful dashboard that keeps you motivated.",
    tag: "Stay on Track",
    tagColor: "#3B82F6",
  },
  {
    Icon: Trophy,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
    title: "Olympiad Ready",
    description:
      "Courses built specifically for national Olympiads — Science, Math, Geography, and Computing — with syllabus-aligned content.",
    tag: "Compete & Win",
    tagColor: "#F59E0B",
  },
  {
    Icon: BookMarked,
    iconBg: "#F5F3FF",
    iconColor: "#8B5CF6",
    title: "Full Syllabus Coverage",
    description:
      "Every module, every topic, every chapter — neatly organized so nothing slips through the cracks before exam day.",
    tag: "Complete Coverage",
    tagColor: "#8B5CF6",
  },
  {
    Icon: Zap,
    iconBg: "#F0FDFA",
    iconColor: "#1B8A7A",
    title: "Learn Anywhere",
    description:
      "Native mobile app for iOS and Android. Content loads fast, works great on any screen, anytime — even with limited connectivity.",
    tag: "Mobile-First",
    tagColor: "#1B8A7A",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-white border-t border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up">
          <p
            className="text-xs uppercase tracking-widest text-[#E8720C] mb-3"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Features
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#1B3A6E] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Everything a student needs to excel
          </h2>
          <p
            className="text-[#6B7280] text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Parikshanam packs a full learning system into one beautifully simple app.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map(({ Icon, iconBg, iconColor, title, description, tag, tagColor }, i) => (
            <div
              key={title}
              className={`animate-fade-in-up delay-${Math.min(i + 1, 6)} group flex flex-col p-5 sm:p-7 rounded-[2rem] border border-[#E5E0D8] bg-[#F9F7F5] hover:border-[#E8720C] hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(232,114,12,0.08)] transition-all`}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border-b-4 transition-all group-hover:translate-y-[2px] group-hover:border-b-2"
                style={{
                  background: iconBg,
                  borderColor: iconColor + "66",
                }}
              >
                <Icon size={22} color={iconColor} strokeWidth={2} />
              </div>

              {/* Tag */}
              <span
                className="inline-block mb-3 px-3 py-0.5 rounded-full text-[11px] uppercase tracking-widest"
                style={{
                  background: tagColor + "15",
                  color: tagColor,
                  fontFamily: "var(--font-nunito-var)",
                  fontWeight: 800,
                }}
              >
                {tag}
              </span>

              <h3
                className="text-lg text-[#111827] mb-2"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                {title}
              </h3>
              <p
                className="text-sm text-[#6B7280] leading-relaxed"
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
