"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Star } from "lucide-react";
import type { Course, Purchase, UserProgress } from "@/lib/types";
import { formatPrice, classRange, discountPercent, olympiadLabel } from "@/lib/courseUtils";

export function DashboardClient({
  featuredCourse,
  purchases,
}: {
  featuredCourse: Course;
  purchases: Purchase[];
  progress: UserProgress[];
}) {
  const purchased = purchases.some(
    (p) => p.course_id === featuredCourse.id && p.status === "completed",
  );
  const olympiad = olympiadLabel(featuredCourse);
  const cls = classRange(featuredCourse);
  const metaLine = [olympiad, cls].filter(Boolean).join(" • ");
  const hasDiscount = featuredCourse.mrp != null && featuredCourse.mrp > featuredCourse.price;

  return (
    <Link
      href={`/course/${featuredCourse.id}`}
      className="block rounded-2xl bg-white border border-[#E5E0D8] overflow-hidden hover:border-[#E8720C] transition-[border-color,transform] duration-200 hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: 180,
          background: "linear-gradient(135deg, rgba(232,114,12,0.10) 0%, rgba(27,58,110,0.06) 100%)",
        }}
      >
        {featuredCourse.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featuredCourse.thumbnail_url}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <BookOpen size={48} color="#E8720C" strokeWidth={1.5} />
        )}

        {olympiad && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] uppercase tracking-widest"
            style={{ background: "#1B3A6E", color: "white", fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            {olympiad}
          </div>
        )}

        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg"
          style={{ background: "#E8720C", fontFamily: "var(--font-nunito-var)" }}
        >
          <Star size={9} color="white" fill="white" strokeWidth={0} />
          <span style={{ fontSize: 10, color: "white", fontWeight: 800 }}>Featured</span>
        </div>

        {purchased && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90">
            <CheckCircle size={10} color="#22C55E" strokeWidth={2.5} />
            <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700, fontFamily: "var(--font-nunito-var)" }}>Enrolled</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5">
        {metaLine && (
          <p className="text-[11px] uppercase tracking-widest text-[#9CA3AF] mb-1.5" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}>
            {metaLine}
          </p>
        )}
        <h3 className="text-lg text-[#111827] mb-2" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>
          {featuredCourse.title}
        </h3>

        {(featuredCourse.total_lessons > 0 || featuredCourse.duration_hours > 0) && (
          <div className="flex items-center gap-4 mb-3">
            {featuredCourse.total_lessons > 0 && (
              <div className="flex items-center gap-1.5">
                <BookOpen size={12} color="#9CA3AF" strokeWidth={2.5} />
                <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                  {featuredCourse.total_lessons} lessons
                </span>
              </div>
            )}
            {featuredCourse.duration_hours > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock size={12} color="#9CA3AF" strokeWidth={2.5} />
                <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                  {featuredCourse.duration_hours}h
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xl text-[#E8720C]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>
            {formatPrice(featuredCourse.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-[#9CA3AF] line-through" style={{ fontFamily: "var(--font-roboto-var)" }}>
                {formatPrice(featuredCourse.mrp!)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}>
                -{discountPercent(featuredCourse.price, featuredCourse.mrp!)}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
