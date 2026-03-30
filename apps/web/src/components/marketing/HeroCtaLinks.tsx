"use client";

import Link from "next/link";
import { FileDown } from "lucide-react";

import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { buttonProps } from "@/components/ui/buttonStyles";

export function HeroCtaLinks() {
  const track = (cta: string, href: string) => {
    captureClient(AnalyticsEvents.marketing_cta_clicked, { cta, href, surface: "hero" });
  };

  return (
    <div className="animate-fade-in-up delay-3 mt-2 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3.5 md:gap-4 lg:col-start-1 lg:row-start-4 lg:mt-0 lg:flex-nowrap lg:justify-start lg:gap-3 xl:gap-5 2xl:gap-6">
      <Link
        href="/login"
        onClick={() => track("start_learning", "/login")}
        {...buttonProps(
          "primaryHeroLg",
          "w-full min-w-0 justify-center text-center px-6 sm:w-auto sm:min-w-[180px] md:px-8 lg:min-w-0 lg:flex-1 lg:basis-0 lg:px-3 lg:py-3 lg:text-sm lg:whitespace-nowrap xl:px-6 xl:py-4 xl:text-base 2xl:px-8 2xl:py-5 2xl:text-lg",
        )}
      >
        Start Learning
      </Link>
      <Link
        href="/research-quiz"
        onClick={() => track("free_quizzes", "/research-quiz")}
        {...buttonProps(
          "outlineHero",
          "w-full min-w-0 justify-center text-center border-[#E5E0D8] bg-white px-5 py-3.5 sm:w-auto sm:min-w-[180px] sm:py-4 md:py-5 lg:min-w-0 lg:flex-1 lg:basis-0 lg:px-3 lg:py-3 lg:text-sm lg:whitespace-nowrap xl:px-5 xl:py-4 xl:text-base 2xl:px-7 2xl:py-5 2xl:text-lg",
        )}
      >
        Free quizzes
      </Link>
      <Link
        href="/ysc"
        onClick={() => track("ysc_certificate", "/ysc")}
        {...buttonProps(
          "outlineHero",
          "w-full min-w-0 justify-center gap-2 text-center border-[#1B8A7A]/45 bg-white text-[#1B3A6E] hover:border-[#1B8A7A] hover:bg-[#1B8A7A]/[0.06] hover:text-[#1B8A7A] px-5 py-3.5 sm:w-auto sm:min-w-[180px] sm:py-4 md:py-5 lg:min-w-0 lg:flex-1 lg:basis-0 lg:gap-1.5 lg:px-2.5 lg:py-3 lg:text-sm lg:whitespace-nowrap xl:gap-2 xl:px-5 xl:py-4 xl:text-base 2xl:px-6 2xl:py-5 2xl:text-lg",
        )}
      >
        <FileDown strokeWidth={2.25} className="h-5 w-5 shrink-0 text-[#1B8A7A] lg:h-4 lg:w-4 xl:h-5 xl:w-5" aria-hidden />
        YSC certificate
      </Link>
    </div>
  );
}
