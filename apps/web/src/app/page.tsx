import Image from "next/image";
import InfoSection from "@/components/InfoSection";

export default function Home() {
  return (
    <main
      className="flex flex-1 min-h-screen flex-col items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,114,12,0.08) 0%, transparent 70%), #F9F7F5",
      }}
    >
      {/* App Icon */}
      <div className="mb-6">
        <Image
          src="/icon.png"
          alt="Parikshanam"
          width={96}
          height={96}
          priority
          className="rounded-2xl"
        />
      </div>

      {/* Wordmark */}
      <h1
        className="text-5xl sm:text-6xl text-[#1B3A6E] tracking-tight mb-4"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
      >
        Parikshanam
      </h1>

      {/* Coming Soon Badge */}
      <div
        className="mb-5 px-6 py-2 rounded-full bg-[#E8720C] border-b-4 border-[#A04F08] text-white uppercase tracking-widest text-sm select-none"
        style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
      >
        Coming Soon
      </div>

      {/* Tagline */}
      <p
        className="text-lg text-[#6B7280] text-center max-w-xs mb-20"
        style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
      >
        Exam prep for Grades 6–10
      </p>

      <InfoSection />
    </main>
  );
}
