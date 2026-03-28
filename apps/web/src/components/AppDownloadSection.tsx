import Image from "next/image";
import { Smartphone, Star, User } from "lucide-react";

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
                {/* Stars */}
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

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(232,114,12,0.3)" }}
                  >
                    <User size={16} color="#E8720C" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p
                      className="text-sm text-white"
                      style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
                    >
                      {name}
                    </p>
                    <p
                      className="text-xs text-[#9CA3AF]"
                      style={{ fontFamily: "var(--font-roboto-var)" }}
                    >
                      {grade}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download CTA */}
        <div
          className="rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          {/* Left copy */}
          <div className="text-center md:text-left">
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
              Download it free today.
            </h3>
            <p
              className="text-[#9CA3AF] text-base max-w-md"
              style={{ fontFamily: "var(--font-roboto-var)" }}
            >
              Available on iOS and Android. Get started in under 2 minutes — sign in with Google and start your first lesson immediately.
            </p>
          </div>

          {/* Right: download buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-4 shrink-0">
            {/* App Store */}
            <div
              className="flex items-center gap-3 px-6 py-4 rounded-2xl border-b-4 border-white/20 cursor-pointer hover:translate-y-[1px] hover:border-b-[3px] transition-all select-none"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderBottom: "4px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <Smartphone size={24} color="white" strokeWidth={1.5} />
              </div>
              <div>
                <p
                  className="text-[10px] text-[#9CA3AF] uppercase tracking-widest leading-none mb-0.5"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                >
                  Download on the
                </p>
                <p
                  className="text-lg text-white leading-tight"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  App Store
                </p>
              </div>
            </div>

            {/* Play Store */}
            <div
              className="flex items-center gap-3 px-6 py-4 rounded-2xl cursor-pointer hover:translate-y-[1px] hover:border-b-[3px] transition-all select-none"
              style={{ background: "rgba(232,114,12,0.18)", border: "1px solid rgba(232,114,12,0.30)", borderBottom: "4px solid rgba(160,79,8,0.4)" }}
            >
              <div>
                <Smartphone size={24} color="#E8720C" strokeWidth={1.5} />
              </div>
              <div>
                <p
                  className="text-[10px] text-[#F5A623] uppercase tracking-widest leading-none mb-0.5"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                >
                  Get it on
                </p>
                <p
                  className="text-lg text-white leading-tight"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  Google Play
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
