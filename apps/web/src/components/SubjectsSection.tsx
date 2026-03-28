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
      "Number theory, algebra, geometry, and combinatorics — the complete toolkit for Math Olympiads from IMO to NSO.",
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
      "From physical geography to human geography — understand the world and compete in national-level geo olympiads.",
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
      "Computational thinking, algorithms, and digital fundamentals — the new-age subject every future leader must master.",
    olympiad: "UCO · IEO",
  },
];

export default function SubjectsSection() {
  return (
    <section id="subjects" className="py-24 px-6 bg-[#F9F7F5]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs uppercase tracking-widest text-[#E8720C] mb-3"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
          >
            Subjects
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#1B3A6E] mb-4"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            Choose your battlefield
          </h2>
          <p
            className="text-[#6B7280] text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-roboto-var)" }}
          >
            Specialized Olympiad coaching across four high-impact subjects.
          </p>
        </div>

        {/* Subject grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUBJECTS.map(({ Icon, label, color, bg, border, description, olympiad }) => (
            <div
              key={label}
              className="group flex flex-col rounded-[2rem] overflow-hidden border border-[#E5E0D8] bg-white hover:border-[#E8720C] hover:-translate-y-1 transition-all"
            >
              {/* Top color bar */}
              <div
                className="h-1.5"
                style={{ background: color }}
              />

              <div className="p-6 flex flex-col flex-1">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-b-4 transition-all group-hover:translate-y-[2px] group-hover:border-b-2"
                  style={{ background: bg, border: `1px solid ${border}`, borderBottom: `4px solid ${border}` }}
                >
                  <Icon size={26} color={color} strokeWidth={2} />
                </div>

                <h3
                  className="text-lg text-[#1B3A6E] mb-2"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                >
                  {label}
                </h3>
                <p
                  className="text-sm text-[#6B7280] leading-relaxed mb-4 flex-1"
                  style={{ fontFamily: "var(--font-roboto-var)" }}
                >
                  {description}
                </p>

                {/* Olympiad badge */}
                <div
                  className="px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest"
                  style={{
                    background: bg,
                    color,
                    fontFamily: "var(--font-nunito-var)",
                    fontWeight: 800,
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
