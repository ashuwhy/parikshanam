import Link from "next/link";
import { buttonProps } from "@/components/ui/buttonStyles";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Download, Trophy } from "lucide-react";

/** Fixed icon tile: all steps use the same box so the connector line aligns to geometric center. */
const ICON_BOX =
  "box-border flex size-20 shrink-0 items-center justify-center rounded-[var(--radius-nested)] border transition-[box-shadow,border-color] duration-200 ease-out shadow-[0_6px_20px_-8px_rgba(27,58,110,0.12)] group-hover:shadow-[0_10px_28px_-8px_rgba(27,58,110,0.16)]";

type StepItem = {
  step: number;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

const STEPS: StepItem[] = [
  {
    step: 1,
    Icon: Download,
    iconBg: "#FFF7ED",
    iconColor: "#E8720C",
    title: "Download & Sign Up",
    description:
      "Get Parikshanam from the App Store or Play Store. Sign in with Google in seconds - no lengthy forms.",
  },
  {
    step: 2,
    Icon: BookOpen,
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "Pick Your Course",
    description:
      "Browse courses matched to your grade and Olympiad. Every course shows lessons, duration, and what you'll learn upfront.",
  },
  {
    step: 3,
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
    <section id="how-it-works" className="relative py-24 md:py-32 px-6 sm:px-8 bg-white border-t border-[#E5E0D8]/90 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[8%] w-96 h-96 rounded-full opacity-[0.08] blur-3xl" style={{ background: "radial-gradient(circle, rgba(245,198,66,0.4) 0%, transparent 70%)" }} />
        <div className="absolute bottom-20 left-[12%] w-80 h-80 rounded-full opacity-[0.06] blur-3xl" style={{ background: "radial-gradient(circle, rgba(27,138,122,0.35) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <p
            className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#C65F0A] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            How It Works
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-[2.75rem] md:leading-tight text-[#1B3A6E] mb-5 text-balance max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
          >
            From signup to Olympiad gold - in 3 steps
          </h2>
          <p
            className="text-[#4B5563] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
          >
            Simple enough to get started in under 2 minutes. Powerful enough to carry you through nationals.
          </p>
        </div>

        {/* Steps - connector through center of fixed 80×80 tiles (md+ one row) */}
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div
            className="pointer-events-none absolute inset-x-[18%] top-10 z-0 hidden h-0.5 rounded-full bg-gradient-to-r from-[#E8720C]/40 via-[#3B82F6]/30 to-[#F59E0B]/40 md:block"
            aria-hidden
          />

          {STEPS.map(({ step, Icon, iconBg, iconColor, title, description }, i) => (
            <div
              key={step}
              className={`animate-fade-in-up delay-${Math.min(i + 1, 6)} relative z-10 flex flex-col items-center text-center group`}
            >
              <div className="relative mb-7">
                <div className={ICON_BOX} style={{ background: iconBg, borderColor: `${iconColor}55` }}>
                  <Icon size={32} color={iconColor} strokeWidth={2.2} className="shrink-0" aria-hidden />
                </div>
                <div
                  className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border-2 border-white text-sm text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                  style={{
                    background: iconColor,
                    fontFamily: "var(--font-nunito-var)",
                    fontWeight: 900,
                  }}
                >
                  {step}
                </div>
              </div>

              <h3
                className="mb-3 text-xl text-[#111827] transition-colors duration-200 group-hover:text-[#E8720C] sm:text-2xl"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.015em" }}
              >
                {title}
              </h3>
              <p
                className="max-w-[16rem] text-base leading-[1.65] text-[#6B7280] md:max-w-none"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA - enhanced */}
        <div className="mt-16 md:mt-20 text-center">
          <Link href="#download" {...buttonProps("primaryNavyLg")}>
            Start for Free - Download Now
          </Link>
        </div>
      </div>
    </section>
  );
}
