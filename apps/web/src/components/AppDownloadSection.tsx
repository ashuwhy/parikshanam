import Link from "next/link";
import Image from "next/image";
import { Star, User, Monitor, Smartphone } from "lucide-react";
import { buttonProps } from "@/components/ui/buttonStyles";
import { cn } from "@/lib/cn";

const REVIEWS = [
  {
    name: "Aryan M.",
    grade: "Class 9",
    text: "I went from average to rank 3 in my district NSO. The quizzes are especially helpful - detailed explanations make all the difference.",
    stars: 5,
  },
  {
    name: "Shreya P.",
    grade: "Class 7",
    text: "Super easy to use and the video lessons are so clear. I finally understand geometry the way my school never explained it.",
    stars: 5,
  },
  {
    name: "Rohan K.",
    grade: "Class 10",
    text: "Love that I can track which lessons I've finished and which quizzes I still need to take. Keeps me super organized before exams.",
    stars: 5,
  },
];

export default function AppDownloadSection() {
  return (
    <section id="download" className="relative py-28 md:py-36 px-6 sm:px-8 bg-[#1B3A6E] overflow-hidden">
      {/* Enhanced background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 75% 40%, rgba(232,114,12,0.16) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 15% 75%, rgba(27,138,122,0.14) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 50% 10%, rgba(245,198,66,0.10) 0%, transparent 60%)",
        }}
      />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Reviews - enhanced */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p
              className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#F5A84A] mb-4"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Student Reviews
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-[2.75rem] md:leading-tight text-white mb-3 text-balance max-w-3xl mx-auto"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
            >
              Loved by 10,000+ students
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} color="#F5C842" fill="#F5C842" strokeWidth={0} />
              ))}
              <span className="ml-2 text-[#D1D5DB] text-lg" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
                4.9/5 average rating
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map(({ name, grade, text, stars }) => (
              <div
                key={name}
                className="rounded-[var(--radius-card)] p-7 flex flex-col gap-5 border border-white/12 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] transition-[border-color,box-shadow] duration-200 ease-out hover:border-white/22 hover:shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_12px_40px_-16px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={16} color="#F5C842" fill="#F5C842" strokeWidth={0} />
                  ))}
                </div>
                <p
                  className="text-base text-[#E8EAED] leading-[1.65] flex-1"
                  style={{ fontFamily: "var(--font-roboto-var)" }}
                >
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-[#E8720C]/40"
                    style={{ background: "rgba(232,114,12,0.25)" }}
                  >
                    <User size={18} color="#E8720C" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-base text-white" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>
                      {name}
                    </p>
                    <p className="text-sm text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                      {grade}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA - same surface language as hero / courses (cream card on navy band) */}
        <div
          className={cn(
            "flex flex-col gap-8 rounded-[var(--radius-card)] border border-[#E5E0D8] bg-[#FFFBF7] p-6 sm:p-8 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:p-12",
            "shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_40px_-18px_rgba(27,58,110,0.1)]",
          )}
        >
          {/* Left copy */}
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-[26rem] lg:text-left xl:max-w-lg">
            <div className="mb-6 flex items-center justify-center gap-3 sm:mb-7 lg:justify-start">
              <Image
                src="/icon.png"
                width={52}
                height={52}
                alt=""
                className="h-[52px] w-[52px] shrink-0 rounded-[var(--radius-icon-tile)] border border-[#E5E0D8] shadow-[0_4px_16px_-4px_rgba(27,58,110,0.15)]"
              />
              <span
                className="text-2xl tracking-tight text-[#1B3A6E] sm:text-[1.65rem]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.02em" }}
              >
                Parikshanam
              </span>
            </div>
            <p
              className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#C65F0A] sm:text-xs"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Start in your browser
            </p>
            <h3
              className="mb-4 text-balance text-3xl leading-[1.12] text-[#1B3A6E] sm:text-4xl md:text-[2.25rem]"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.03em" }}
            >
              Start learning right now.
            </h3>
            <p
              className="mx-auto max-w-[32rem] text-base leading-[1.65] text-[#4B5563] lg:mx-0"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
            >
              Sign in with Google and start your first lesson in under 2 minutes - no download, no setup, works on any
              device.
            </p>
          </div>

          {/* CTAs - shared system buttons; narrow column on mobile */}
          <div className="mx-auto flex w-full max-w-[17.5rem] shrink-0 flex-col gap-3 sm:max-w-xs lg:mx-0 lg:w-[min(100%,18.5rem)]">
            <Link
              href="/login"
              {...buttonProps(
                "primaryHeroLg",
                cn(
                  "flex w-full min-h-[3.5rem] items-center justify-center gap-2.5 text-center sm:min-h-16",
                  "px-4 sm:px-6",
                ),
              )}
            >
              <Monitor className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} aria-hidden />
              Get Started
            </Link>

            <div
              className={cn(
                "box-border flex min-h-[3.5rem] w-full items-center justify-center gap-3 rounded-[var(--radius-button)] border-2 border-[#E5E0D8] bg-white px-4 py-3 sm:min-h-16 sm:px-5",
                "shadow-[0_3px_0_0_#E3DED4]",
              )}
              role="note"
              aria-label="Mobile apps coming soon on iOS and Android"
            >
              <Smartphone className="h-5 w-5 shrink-0 text-[#1B8A7A]" strokeWidth={2.25} aria-hidden />
              <div className="flex min-w-0 flex-col justify-center gap-0.5 text-left leading-tight">
                <span
                  className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6B7280] sm:text-[11px]"
                  style={{ fontFamily: "var(--font-nunito-var)" }}
                >
                  Coming soon on
                </span>
                <span
                  className="text-base font-black tracking-tight text-[#1B3A6E] sm:text-[1.0625rem]"
                  style={{ fontFamily: "var(--font-nunito-var)" }}
                >
                  iOS &amp; Android
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
