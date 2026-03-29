"use client";

import Link from "next/link";
import { memo } from "react";
import { BookOpen, Clock } from "lucide-react";
import type { Course } from "@/lib/types";
import { formatPrice, classRange, discountPercent } from "@/lib/courseUtils";
import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";

function getOlympiadLabel(course: Course): string | null {
  return course.olympiad_type?.label ?? null;
}

function CourseCardInner({
  course,
  listSource = "unknown",
}: {
  course: Course;
  /** Where the card was rendered (explore, showcase, etc.). */
  listSource?: string;
}) {
  const olympiad = getOlympiadLabel(course);
  const cls = classRange(course);
  const metaLine = [olympiad, cls].filter(Boolean).join(" • ");
  const hasDiscount = course.mrp != null && course.mrp > course.price;

  return (
    <Link
      href={`/course/${course.id}`}
      onClick={() =>
        captureClient(AnalyticsEvents.course_card_clicked, {
          course_id: course.id,
          title: course.title,
          list_source: listSource,
          olympiad_type_id: course.olympiad_type_id ?? undefined,
        })
      }
      className="group flex flex-col rounded-[var(--radius-card)] bg-white border border-[#E5E0D8] overflow-hidden hover:border-[#E8720C] hover:-translate-y-0.5 transition-[border-color,transform] duration-200"
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: 148,
          background: "linear-gradient(135deg, rgba(232,114,12,0.08) 0%, rgba(27,58,110,0.04) 100%)",
        }}
      >
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <BookOpen size={36} color="#E8720C" strokeWidth={1.5} />
        )}

        {olympiad && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-widest"
            style={{ background: "#1B3A6E", color: "white", fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            {olympiad}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        {metaLine && (
          <p
            className="text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-1.5"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
          >
            {metaLine}
          </p>
        )}

        <h3
          className="text-sm text-[#111827] leading-snug mb-auto"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
        >
          {course.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 mb-3">
          {course.total_lessons > 0 && (
            <div className="flex items-center gap-1">
              <BookOpen size={11} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {course.total_lessons} lessons
              </span>
            </div>
          )}
          {course.duration_hours > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={11} color="#9CA3AF" strokeWidth={2.5} />
              <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {course.duration_hours}h
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span
            className="text-base text-[#E8720C]"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            {formatPrice(course.price)}
          </span>
          {hasDiscount && (
            <>
              <span
                className="text-xs text-[#9CA3AF] line-through"
                style={{ fontFamily: "var(--font-roboto-var)" }}
              >
                {formatPrice(course.mrp!)}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                -{discountPercent(course.price, course.mrp!)}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export const CourseCard = memo(CourseCardInner);
