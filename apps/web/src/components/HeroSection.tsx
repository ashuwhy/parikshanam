import { HeroVideo } from "@/components/HeroVideo";
import { HeroCtaLinks } from "@/components/marketing/HeroCtaLinks";
import { cn } from "@/lib/cn";

/** Hero promo video (YouTube ID). */
const HERO_VIDEO_ID = "SQX03U2Kjes";

type HeroStat = {
  delay: string;
  highlight: string;
  lines: readonly string[];
  /** Split highlight onto two lines on mobile only */
  highlightMobile?: readonly [string, string];
};

const STATS: readonly HeroStat[] = [
  {
    delay: "delay-1",
    highlight: "40%",
    lines: ["IITIANS", "are dropper"],
  },
  {
    delay: "delay-2",
    highlight: "< 600 ranker",
    highlightMobile: ["< 600", "ranker"],
    lines: ["give government", "olympiad!"],
  },
  {
    delay: "delay-3",
    highlight: "ISRO / TIFR",
    lines: ["CAMP", "BY GOI"],
  },
];

/** Desktop hero stat tiles — compact padding at lg+ (overrides sm/xl below). */
const statCardClass =
  "group min-w-0 flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-[#E5E0D8] bg-[#FAF8F6] py-3 px-1.5 text-center shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_10px_36px_-18px_rgba(27,58,110,0.08)] transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-[#E8720C]/40 hover:bg-white hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_18px_44px_-14px_rgba(232,114,12,0.12)] sm:px-4 sm:py-5 xl:py-6 2xl:px-5 2xl:py-7 lg:px-2.5 lg:py-3 xl:px-3 xl:py-3.5 2xl:px-3.5 2xl:py-4";

/** Compact stat tiles for the mobile hero row beside portrait video. */
const statCardClassMobile =
  "group min-w-0 flex flex-1 flex-col items-center justify-center rounded-[var(--radius-card)] border border-[#E5E0D8] bg-[#FAF8F6] px-2 py-2.5 text-center shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_8px_28px_-14px_rgba(27,58,110,0.08)] transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-[#E8720C]/40 hover:bg-white sm:px-2.5 sm:py-3";

function PortraitVideo({ videoId }: { videoId: string }) {
  return (
    <HeroVideo
      videoId={videoId}
      className="mx-0 shrink-0 w-[min(9.75rem,35vw)] max-w-none max-h-[min(50dvh,22rem)] sm:w-[min(11.5rem,37vw)] sm:max-h-[min(54dvh,24rem)]"
    />
  );
}

function HeroHeadline({ className }: { className?: string }) {
  return (
    <h1
      className={cn("text-balance text-[#1B3A6E]", className)}
      style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
    >
      <span className="block text-[#1B3A6E]">Dropper or Topper.</span>
      <span className="mt-1 block text-[0.72em] uppercase tracking-[0.12em] text-[#E8720C] sm:text-[0.75em]">
        To be decided by
      </span>
      <span className="mt-1 block text-[#E8720C]">You today !</span>
    </h1>
  );
}

function HeroFortuneBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-fade-in-up delay-2 mx-auto max-w-xl text-center",
        className,
      )}
    >
      <p
        className="text-base leading-snug text-[#1B3A6E] sm:text-lg md:text-xl"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        Fortune favour the <span className="text-[#E8720C]">EARLY</span> prepared
      </p>
      <p
        className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#4B5563] sm:mt-3 sm:text-xs sm:tracking-[0.16em] md:mt-4 md:text-sm"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
      >
        <span className="block md:inline">Prepare for government olympiad</span>
        <span className="hidden md:inline"> </span>
        <span className="block md:inline">and fix your top rank in life</span>
      </p>
    </div>
  );
}

function StatCards({ mobile }: { mobile: boolean }) {
  const cardClass = mobile ? statCardClassMobile : statCardClass;
  return (
    <>
      {STATS.map(({ delay, highlight, highlightMobile, lines }) => (
        <div
          key={delay}
          className={cn(
            `animate-fade-in-up ${delay}`,
            cardClass,
            "cursor-default",
          )}
        >
          {mobile && highlightMobile ? (
            <div
              className={cn(
                "mb-0.5 text-[#E8720C] tabular-nums tracking-tight",
                "text-sm sm:mb-1 sm:text-base",
              )}
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              {highlightMobile.map((line) => (
                <span key={line} className="block leading-tight">
                  {line}
                </span>
              ))}
            </div>
          ) : (
            <p
              className={cn(
                "mb-0.5 leading-tight text-[#E8720C] tabular-nums tracking-tight",
                mobile
                  ? "text-sm sm:mb-1 sm:text-base"
                  : "mb-1 text-[0.95rem] sm:mb-1.5 sm:text-2xl lg:mb-0.5 xl:text-[1.75rem] 2xl:text-3xl",
              )}
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              {highlight}
            </p>
          )}
          {lines.map((line) => (
            <p
              key={line}
              className={cn(
                "leading-snug text-[#6B7280]",
                mobile ? "text-xs sm:text-sm" : "text-[10px] sm:text-[13px] xl:text-sm 2xl:text-[0.95rem]",
              )}
              style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden border-b border-[#E5E0D8]/90 bg-transparent px-5 pt-20 pb-10 sm:px-8 sm:pt-24 sm:pb-12 md:pb-14 lg:pt-28 xl:px-10 2xl:px-12">
      {/* Mobile */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start md:hidden">
        <div className="mx-auto w-full max-w-lg text-center">
          <HeroHeadline className="animate-fade-in-up mb-4 text-[1.65rem] leading-[1.12] sm:text-3xl sm:leading-[1.1]" />
        </div>

        <div className="animate-fade-in-up delay-1 mx-auto mt-2 flex w-full max-w-lg items-start justify-center gap-2.5 sm:mt-4 sm:gap-3.5">
          <PortraitVideo videoId={HERO_VIDEO_ID} />
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:gap-2.5">
            <div className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-2.5">
              <StatCards mobile />
            </div>
          </div>
        </div>

        <HeroFortuneBlock className="mt-[14px] px-1 sm:mt-7" />

        <div className="mt-4 w-full">
          <HeroCtaLinks />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative z-10 mx-auto hidden w-full max-w-7xl flex-1 flex-col justify-start md:flex lg:justify-center xl:max-w-[88rem] 2xl:max-w-[min(104rem,calc(100vw-6rem))]">
        {/*
          lg: modest width; xl/2xl: much wider shell + large gap-x so copy and video breathe on big monitors.
        */}
        <div className="mx-auto grid w-full max-w-[58rem] grid-cols-1 lg:max-w-[68rem] lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-x-10 lg:items-start lg:gap-y-8 xl:max-w-[76rem] xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] xl:gap-x-16 xl:gap-y-10 2xl:max-w-[88rem] 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] 2xl:gap-x-24 2xl:gap-y-12">
          <div className="mx-auto max-w-2xl text-center sm:mb-10 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mb-0 lg:max-w-2xl lg:text-left xl:max-w-none">
            <HeroHeadline className="animate-fade-in-up mb-4 text-3xl leading-[1.1] sm:mb-5 sm:text-4xl md:text-5xl lg:mb-5 lg:text-[2.75rem] lg:leading-[1.06] xl:text-[3.5rem] 2xl:text-[4rem] 2xl:leading-[1.02]" />
          </div>

          <div className="animate-fade-in-up delay-1 flex justify-center sm:mb-12 lg:mb-0 lg:col-start-2 lg:row-start-1 lg:row-span-4 lg:self-start lg:justify-end">
            <HeroVideo videoId={HERO_VIDEO_ID} />
          </div>

          <div className="animate-fade-in-up delay-2 mt-4 mb-2 sm:mt-10 sm:mb-12 lg:col-start-1 lg:row-start-2 lg:mt-12 lg:mb-0">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-2 xl:gap-2.5 2xl:gap-3">
              <StatCards mobile={false} />
            </div>
          </div>

          <HeroFortuneBlock className="lg:col-start-1 lg:row-start-3 lg:mx-0 lg:mt-2.5 lg:max-w-xl lg:text-left lg:pb-1" />

          <HeroCtaLinks />
        </div>
      </div>
    </section>
  );
}
