import { BookOpen, Clock, CheckCircle, Star } from "lucide-react";

const COURSES = [
  {
    tag: "Science Olympiad",
    tagColor: "#22C55E",
    tagBg: "#F0FDF4",
    title: "Class 8 Science Olympiad — Complete Prep",
    subtitle: "Class 8 • Science Olympiad",
    lessons: 42,
    hours: 18,
    price: "₹999",
    mrp: "₹1,499",
    discount: 33,
    featured: true,
    description:
      "Full NSO & NSTSE prep: Physics, Chemistry, Biology modules with quizzes and previous year question banks.",
  },
  {
    tag: "Math Olympiad",
    tagColor: "#3B82F6",
    tagBg: "#EFF6FF",
    title: "Class 6–7 IMO Foundation Course",
    subtitle: "Class 6–7 • Math Olympiad",
    lessons: 36,
    hours: 14,
    price: "₹799",
    mrp: "₹1,199",
    discount: 33,
    featured: false,
    description:
      "Build a rock-solid foundation in number theory, geometry, and algebra to ace the International Math Olympiad qualifier.",
  },
  {
    tag: "Geography",
    tagColor: "#F59E0B",
    tagBg: "#FFFBEB",
    title: "iGeo & NGO — Grades 9–10",
    subtitle: "Class 9–10 • Geography",
    lessons: 28,
    hours: 11,
    price: "₹699",
    mrp: null,
    discount: null,
    featured: false,
    description:
      "Physical & human geography, climate systems, and map work — tailored for the national and international geography olympiads.",
  },
];

export default function CourseShowcaseSection() {
  return (
    <section id="courses" className="py-24 px-6 bg-[#F9F7F5] border-t border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p
              className="text-xs uppercase tracking-widest text-[#E8720C] mb-3"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Courses
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#1B3A6E]"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Courses built for champions
            </h2>
          </div>
          <a
            href="#download"
            className="shrink-0 text-sm text-[#E8720C] hover:underline"
            style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 600 }}
          >
            See all in the app →
          </a>
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <div
              key={course.title}
              className="group flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-[#E5E0D8] hover:border-[#E8720C] hover:-translate-y-1 transition-all"
            >
              {/* Thumbnail */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  height: 148,
                  background: `linear-gradient(135deg, ${course.tagColor}18 0%, ${course.tagColor}08 100%)`,
                }}
              >
                <BookOpen size={40} color={course.tagColor} strokeWidth={1.5} />

                {/* Tag badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] uppercase tracking-widest"
                  style={{
                    background: course.tagBg,
                    color: course.tagColor,
                    fontFamily: "var(--font-nunito-var)",
                    fontWeight: 800,
                    border: `1px solid ${course.tagColor}30`,
                  }}
                >
                  {course.tag}
                </div>

                {/* Featured badge */}
                {course.featured && (
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg"
                    style={{ background: "#1B3A6E", fontFamily: "var(--font-nunito-var)" }}
                  >
                    <Star size={9} color="white" strokeWidth={2.5} fill="white" />
                    <span style={{ fontSize: 10, color: "white", fontWeight: 800 }}>Featured</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5">
                {/* Meta */}
                <p
                  className="text-[11px] uppercase tracking-widest text-[#9CA3AF] mb-1.5"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                >
                  {course.subtitle}
                </p>

                <h3
                  className="text-base leading-snug text-[#111827] mb-2"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                >
                  {course.title}
                </h3>

                <p
                  className="text-sm text-[#6B7280] leading-relaxed mb-4 flex-1"
                  style={{ fontFamily: "var(--font-roboto-var)" }}
                >
                  {course.description}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} color="#9CA3AF" strokeWidth={2.5} />
                    <span
                      className="text-xs text-[#9CA3AF]"
                      style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
                    >
                      {course.lessons} lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} color="#9CA3AF" strokeWidth={2.5} />
                    <span
                      className="text-xs text-[#9CA3AF]"
                      style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
                    >
                      {course.hours}h
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#F3F4F6] mb-4" />

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xl text-[#E8720C]"
                      style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                    >
                      {course.price}
                    </span>
                    {course.mrp && (
                      <>
                        <span
                          className="text-sm text-[#9CA3AF] line-through"
                          style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
                        >
                          {course.mrp}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px]"
                          style={{
                            background: "#F0FDF4",
                            color: "#16A34A",
                            fontFamily: "var(--font-nunito-var)",
                            fontWeight: 900,
                            border: "1px solid #BBF7D0",
                          }}
                        >
                          -{course.discount}%
                        </span>
                      </>
                    )}
                  </div>
                  <a
                    href="#download"
                    className="flex items-center gap-1.5 text-[11px] text-[#E8720C] hover:underline cursor-pointer"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                  >
                    Enroll in app →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-sm text-[#9CA3AF] mt-8"
          style={{ fontFamily: "var(--font-roboto-var)" }}
        >
          More courses added regularly. Download the app to see the full catalog.
        </p>
      </div>
    </section>
  );
}
