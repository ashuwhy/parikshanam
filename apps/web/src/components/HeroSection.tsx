import { HeroVideo } from "@/components/HeroVideo";
import { HeroCtaLinks } from "@/components/marketing/HeroCtaLinks";

/** Hero promo video (YouTube ID). */
const HERO_VIDEO_ID = "SQX03U2Kjes";

const STATS = [
  { value: "40%+", label: "Of IITians with top ranks took a drop year", delay: "delay-1" },
  { value: "< AIR 600", label: "Where many top aspirants land", delay: "delay-2" },
  { value: "10,000+", label: "Students learning with us", delay: "delay-3" },
] as const;

/** Matches `FeaturesSection` marketing cards (border, surface, shadow, hover). */
const statCardClass =
  "group min-w-0 flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-[#E5E0D8] bg-[#FAF8F6] py-3 px-1.5 text-center shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_10px_36px_-18px_rgba(27,58,110,0.08)] transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-[#E8720C]/40 hover:bg-white hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_18px_44px_-14px_rgba(232,114,12,0.12)] sm:px-4 sm:py-5 xl:py-6 2xl:px-5 2xl:py-7";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden border-b border-[#E5E0D8]/90 bg-transparent px-5 pt-20 pb-10 sm:px-8 sm:pt-24 sm:pb-12 md:pb-14 lg:pt-28 xl:px-10 2xl:px-12">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start lg:justify-center xl:max-w-[88rem] 2xl:max-w-[min(104rem,calc(100vw-6rem))]">
        {/*
          lg: modest width; xl/2xl: much wider shell + large gap-x so copy and video breathe on big monitors.
        */}
        <div className="mx-auto grid w-full max-w-[58rem] grid-cols-1 lg:max-w-[68rem] lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-x-10 lg:items-start lg:gap-y-8 xl:max-w-[76rem] xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] xl:gap-x-16 xl:gap-y-10 2xl:max-w-[88rem] 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] 2xl:gap-x-24 2xl:gap-y-12">
          <div className="mx-auto max-w-2xl text-center sm:mb-10 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mb-0 lg:max-w-2xl lg:text-left xl:max-w-none">
            <p
              className="animate-fade-in-up mb-4 text-[11px] uppercase tracking-[0.16em] text-[#C65F0A] sm:text-xs"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Grades 6–10 · Olympiad &amp; IIT foundation
            </p>
            <h1
              className="animate-fade-in-up mb-4 text-3xl leading-[1.1] text-[#1B3A6E] sm:mb-5 sm:text-4xl md:text-5xl lg:mb-5 lg:text-[2.75rem] lg:leading-[1.06] xl:text-[3.5rem] 2xl:text-[4rem] 2xl:leading-[1.02] text-balance"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
            >
              <span className="block text-[#1B3A6E]">Master Olympiads.</span>
              <span className="mt-1 block text-[#E8720C] lg:mt-0.5">Build the foundation</span>
              <span className="block text-[#E8720C]">for IIT.</span>
            </h1>
            <p
              className="animate-fade-in-up delay-1 mx-auto hidden max-w-md text-base leading-relaxed text-[#4B5563] sm:text-lg lg:mx-0 lg:block xl:max-w-xl 2xl:max-w-2xl 2xl:text-xl"
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
            >
              Grades 6–10, video-first - watch the story, then dive in.
            </p>
          </div>

          <div className="animate-fade-in-up delay-1 flex justify-center sm:mb-12 lg:mb-0 lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:self-start lg:justify-end">
            <HeroVideo videoId={HERO_VIDEO_ID} />
          </div>

          <div className="animate-fade-in-up delay-2 mt-4 mb-2 sm:mt-10 sm:mb-12 lg:col-start-1 lg:row-start-2 lg:mt-12 lg:mb-0">
            <p
              className="mb-4 text-center text-[11px] uppercase tracking-[0.16em] text-[#C65F0A] sm:text-xs lg:text-left"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Why families choose us
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 xl:gap-4 2xl:gap-5">
              {STATS.map(({ value, label, delay }) => (
                <div key={label} className={`animate-fade-in-up ${delay} ${statCardClass} cursor-default`}>
                  <p
                    className="mb-1 text-[0.95rem] leading-tight text-[#E8720C] tabular-nums tracking-tight sm:mb-1.5 sm:text-2xl xl:text-[1.75rem] 2xl:text-3xl"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-[10px] leading-snug text-[#6B7280] sm:text-[13px] xl:text-sm 2xl:text-[0.95rem]"
                    style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HeroCtaLinks />
        </div>
      </div>
    </section>
  );
}
