import { Calculator, FlaskConical, Globe, Laptop } from "lucide-react";

const SUBJECTS = [
  {
    Icon: Calculator,
    label: "Mathematics",
    short: "Math",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    description:
      "Number theory, algebra, geometry, and combinatorics - the complete toolkit for Math Olympiads from IMO to NSO.",
    olympiad: "IMO · NSO · NIMO",
  },
  {
    Icon: FlaskConical,
    label: "Science",
    short: "Science",
    color: "#22C55E",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    description:
      "Physics, Chemistry, and Biology combined into one powerhouse curriculum. Master experiments, equations, and ecosystems.",
    olympiad: "NSO · NSTSE · IAIS",
  },
  {
    Icon: Globe,
    label: "Geography",
    short: "Geography",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    description:
      "From physical geography to human geography - understand the world and compete in national-level geo olympiads.",
    olympiad: "iGeo · NGO",
  },
  {
    Icon: Laptop,
    label: "Computing",
    short: "Computing",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    description:
      "Computational thinking, algorithms, and digital fundamentals - the new-age subject every future leader must master.",
    olympiad: "UCO · IEO",
  },
];

export default function SubjectsSection() {
  return (
    <section id="subjects" className="relative overflow-hidden bg-transparent py-24 md:py-32 px-6 sm:px-8">
      {/* Doodles: single fixed layer in root layout only - wash tints over that. */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute inset-0 bg-[#F9F7F5]/55" />
        <div
          className="absolute top-10 left-[15%] h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-[10%] h-80 w-80 rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16 animate-fade-in-up">
          <p
            className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#C65F0A] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Subjects
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-[2.75rem] md:leading-tight text-[#1B3A6E] mb-5 text-balance max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.025em" }}
          >
            Choose your battlefield
          </h2>
          <p
            className="text-[#4B5563] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 400 }}
          >
            Specialized Olympiad coaching across four high-impact subjects.
          </p>
        </div>

        {/* Subject grid - enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SUBJECTS.map(({ Icon, label, color, bg, border, description, olympiad }, i) => (
            <div
              key={label}
              className={`animate-fade-in-up delay-${i + 1} group flex flex-col rounded-[var(--radius-card)] overflow-hidden border border-[#E5E0D8] bg-white shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_40px_-20px_rgba(27,58,110,0.09)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#E8720C]/45 hover:shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_20px_48px_-16px_rgba(232,114,12,0.14)] cursor-default`}
            >
              {/* Top color bar - enhanced */}
              <div className="h-1.5 shrink-0" style={{ background: color }} />

              <div className="p-7 flex flex-col flex-1">
                {/* Icon - enhanced */}
                <div
                  className="w-16 h-16 rounded-[var(--radius-nested)] flex items-center justify-center mb-5 border transition-[box-shadow,border-color] duration-200 ease-out shadow-[0_2px_10px_-2px_rgba(27,58,110,0.1)] group-hover:shadow-[0_8px_20px_-6px_rgba(27,58,110,0.14)]"
                  style={{ background: bg, borderColor: border }}
                >
                  <Icon size={30} color={color} strokeWidth={2.2} />
                </div>

                <h3
                  className="text-lg sm:text-xl text-[#1B3A6E] mb-3 group-hover:text-[#E8720C] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900, letterSpacing: "-0.015em" }}
                >
                  {label}
                </h3>
                <p
                  className="text-sm text-[#6B7280] leading-[1.65] mb-5 flex-1"
                  style={{ fontFamily: "var(--font-roboto-var)" }}
                >
                  {description}
                </p>

                {/* Olympiad badge - enhanced */}
                <div
                  className="px-4 py-2 rounded-[var(--radius-control-sm)] text-xs uppercase tracking-widest border-2 text-center"
                  style={{
                    background: bg,
                    borderColor: border,
                    color,
                    fontFamily: "var(--font-nunito-var)",
                    fontWeight: 900,
                  }}
                >
                  {olympiad}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
