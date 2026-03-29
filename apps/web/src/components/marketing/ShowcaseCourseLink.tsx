"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";

type Props = {
  courseId: string;
  courseTitle: string;
  className: string;
  children: ReactNode;
};

export function ShowcaseCourseLink({ courseId, courseTitle, className, children }: Props) {
  return (
    <Link
      href="/login"
      className={className}
      onClick={() =>
        captureClient(AnalyticsEvents.course_card_clicked, {
          course_id: courseId,
          title: courseTitle,
          list_source: "home_showcase",
          destination: "/login",
        })
      }
    >
      {children}
    </Link>
  );
}
