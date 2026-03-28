import Link from "next/link";
import Image from "next/image";
import { Star, User, Monitor, Smartphone } from "lucide-react";

const REVIEWS = [
  {
    name: "Aryan M.",
    grade: "Class 9",
    text: "I went from average to rank 3 in my district NSO. The quizzes are especially helpful — detailed explanations make all the difference.",
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
    <section id="download" className="py-24 px-6 bg-[#1B3A6E] overflow-hidden relative">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 50%, rgba(232,114,12,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(27,138,122,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Reviews */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p
              className="text-xs uppercase tracking-widest text-[#E8720C] mb-3"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Student Reviews
            </p>
            <h2
              className="text-3xl md:text-4xl text-white"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Loved by 10,000+ students
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map(({ name, grade, text, stars }) => (
              <div
                key={name}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} color="#F5C842" fill="#F5C842" strokeWidth={0} />
                  ))}
                </div>
                <p
                  className="text-sm text-[#D1D5DB] leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-roboto-var)" }}
                >
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(232,114,12,0.3)" }}
                  >
                    <User size={16} color="#E8720C" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm text-white" style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}>
                      {name}
                    </p>
                    <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
                      {grade}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA card */}
        <div
          className="rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          {/* Left copy */}
          <div className="text-center md:text-left max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <Image src="/icon.png" width={52} height={52} alt="Parikshanam" className="rounded-xl" />
              <span
                className="text-2xl text-white"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                Parikshanam
              </span>
            </div>
            <h3
              className="text-3xl md:text-4xl text-white mb-3"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
            >
              Start learning right now.
            </h3>
            <p
              className="text-[#9CA3AF] text-base"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Sign in with Google and start your first lesson in under 2 minutes — no download, no setup, works on any device.
            </p>
          </div>

          {/* Right: action options */}
          <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
            {/* Primary: web app */}
            <Link
              href="/login"
              className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-white border-b-4 border-[#A04F08] hover:bg-[#d4640a] active:translate-y-[2px] active:border-b-2 transition-all select-none"
              style={{
                background: "#E8720C",
                fontFamily: "var(--font-nunito-var)",
                fontWeight: 900,
                fontSize: "1.05rem",
                minWidth: 260,
              }}
            >
              <Monitor size={22} strokeWidth={2} />
              Start in Browser — Free
            </Link>

            {/* Secondary: mobile app */}
            <div
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl cursor-pointer hover:translate-y-[1px] transition-all select-none opacity-70"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontFamily: "var(--font-nunito-var)",
                fontWeight: 800,
                color: "white",
                minWidth: 260,
              }}
            >
              <Smartphone size={20} strokeWidth={1.8} />
              <div className="text-left">
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Also available on</p>
                <p style={{ fontSize: 15, lineHeight: 1 }}>iOS &amp; Android</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
