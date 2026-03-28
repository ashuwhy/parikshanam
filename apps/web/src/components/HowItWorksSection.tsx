import { Download, BookOpen, Trophy } from "lucide-react";

const STEPS = [
  {
    step: "01",
    Icon: Download,
    iconBg: "#FFF7ED",
    iconColor: "#E8720C",
    title: "Download & Sign Up",
    description:
      "Get Parikshanam from the App Store or Play Store. Sign in with Google in seconds — no lengthy forms.",
  },
  {
    step: "02",
    Icon: BookOpen,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "Pick Your Course",
    description:
      "Browse courses matched to your grade and Olympiad. Every course shows lessons, duration, and what you'll learn upfront.",
  },
  {
    step: "03",
    Icon: Trophy,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
    title: "Learn, Quiz & Win",
    description:
      "Watch expert lessons, take quizzes, track your progress, and walk into exam day feeling completely prepared.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-white border-t border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs uppercase tracking-widest text-[#E8720C] mb-3"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            How It Works
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#1B3A6E] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            From signup to Olympiad gold — in 3 steps
          </h2>
          <p
            className="text-[#6B7280] text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Simple enough to get started in under 2 minutes. Powerful enough to carry you through nationals.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[3.5rem] left-[calc(16.7%+1.5rem)] right-[calc(16.7%+1.5rem)] h-px bg-[#E5E0D8] z-0" />

          {STEPS.map(({ step, Icon, iconBg, iconColor, title, description }) => (
            <div key={step} className="relative z-10 flex flex-col items-center text-center">
              {/* Step icon with number badge */}
              <div className="relative mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border-b-4"
                  style={{
                    background: iconBg,
                    borderColor: iconColor + "66",
                  }}
                >
                  <Icon size={28} color={iconColor} strokeWidth={2} />
                </div>
                {/* Number badge */}
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: iconColor,
                    fontFamily: "var(--font-nunito-var)",
                    fontWeight: 900,
                    fontSize: 11,
                  }}
                >
                  {step.replace("0", "")}
                </div>
              </div>

              <h3
                className="text-xl text-[#111827] mb-2"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
              >
                {title}
              </h3>
              <p
                className="text-sm text-[#6B7280] leading-relaxed max-w-xs"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="#download"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#E8720C] text-white text-base border-b-4 border-[#A04F08] hover:bg-[#d4640a] hover:translate-y-[1px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 transition-all select-none cursor-pointer"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Start for Free — Download Now
          </a>
        </div>
      </div>
    </section>
  );
}
