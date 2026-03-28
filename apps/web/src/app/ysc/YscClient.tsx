"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Download, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import type { YscStudentRecord } from "@/lib/ysc/types";
import { sanitizeDownloadFilePart } from "@/lib/ysc/sanitizeFilename";

function findStudentsByNameQuery(
  students: YscStudentRecord[],
  query: string,
): YscStudentRecord[] {
  const q = query.trim().toUpperCase().replace(/\s+/g, " ");
  if (!q) return [];
  return students.filter((s) =>
    s.name.trim().toUpperCase().replace(/\s+/g, " ").includes(q),
  );
}

type Props = {
  students: YscStudentRecord[];
};

export default function YscClient({ students }: Props) {
  const [searchName, setSearchName] = useState("");
  const [searched, setSearched] = useState(false);
  const [matches, setMatches] = useState<YscStudentRecord[]>([]);
  const [selected, setSelected] = useState<YscStudentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const found = findStudentsByNameQuery(students, searchName);
    setMatches(found);
    if (found.length === 1) {
      setSelected(found[0]!);
    } else {
      setSelected(null);
    }
  };

  const handleDownload = async (student: YscStudentRecord) => {
    setDownloading(true);
    try {
      const response = await fetch("/api/ysc/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNo: student.rollNo,
          name: student.name,
        }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error ?? "Failed to generate certificate");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safe = sanitizeDownloadFilePart(student.name);
      a.download = `YSC-${student.certificateType}-${safe}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Certificate downloaded");
    } catch {
      toast.error("Could not download the certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 pt-28">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-8 transition-colors"
          style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
        >
          <ArrowLeft size={16} aria-hidden />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <h1
            className="text-4xl text-[#1B3A6E] mb-2"
            style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
          >
            YSC certificate download
          </h1>
          <p className="text-[#6B7280]" style={{ fontFamily: "var(--font-roboto-var)" }}>
            Young Scientist Challenge - APS Kolkata
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-[var(--radius-card)] border-2 border-[#E5E0D8] p-6 mb-6 shadow-sm"
        >
          <label
            className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3"
            style={{ fontFamily: "var(--font-nunito-var)" }}
          >
            Enter your name
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. PARIDHI JHA"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1 min-w-0 px-4 py-3 rounded-[var(--radius-control-sm)] border-2 border-[#E5E0D8] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E8720C] transition-colors"
              style={{ fontFamily: "var(--font-roboto-var)" }}
              required
            />
            <Button
              type="submit"
              variant="primarySm"
              className="shrink-0 flex items-center justify-center gap-2"
              disabled={downloading}
            >
              <Search size={16} aria-hidden />
              Search
            </Button>
          </div>
        </form>

        {searched && matches.length === 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-[var(--radius-card)] p-6 text-center">
            <AlertCircle size={32} color="#DC2626" className="mx-auto mb-3" aria-hidden />
            <h3
              className="text-lg font-bold text-red-700 mb-1"
              style={{ fontFamily: "var(--font-nunito-var)" }}
            >
              Student not found
            </h3>
            <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-roboto-var)" }}>
              We could not find &quot;{searchName.trim()}&quot; in the YSC records. Check spelling and
              try your full name as registered.
            </p>
          </div>
        )}

        {searched && matches.length > 1 && !selected && (
          <div className="bg-white border-2 border-[#E5E0D8] rounded-[var(--radius-card)] p-6 mb-6">
            <h3
              className="text-lg text-[#111827] mb-3"
              style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
            >
              Multiple matches - pick your row
            </h3>
            <ul className="flex flex-col gap-2">
              {matches.map((m) => (
                <li key={`${m.rollNo}-${m.class}-${m.subject}`}>
                  <button
                    type="button"
                    onClick={() => setSelected(m)}
                    className="w-full text-left rounded-[var(--radius-control-sm)] border-2 border-[#E5E0D8] px-4 py-3 hover:border-[#E8720C] hover:bg-[#FFFBF7] transition-colors"
                  >
                    <span
                      className="block text-[#111827] font-bold"
                      style={{ fontFamily: "var(--font-nunito-var)" }}
                    >
                      {m.name}
                    </span>
                    <span
                      className="text-sm text-[#6B7280]"
                      style={{ fontFamily: "var(--font-roboto-var)" }}
                    >
                      Roll {m.rollNo} · Class {m.class} · {m.subject}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selected && (
          <div
            className="relative z-0 overflow-hidden rounded-[var(--radius-card)] border-2 border-[#E8720C] p-6 shadow-[0_16px_48px_-14px_rgba(27,58,110,0.18)]"
            style={{
              background:
                "radial-gradient(ellipse 120% 90% at 100% 0%, rgba(232, 114, 12, 0.12), transparent 52%), radial-gradient(ellipse 100% 80% at 0% 100%, rgba(27, 58, 110, 0.08), transparent 48%), linear-gradient(165deg, #ffffff 0%, #fffbf7 38%, #f3f7fd 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.14]"
              style={{ background: "radial-gradient(circle, #E8720C 0%, transparent 70%)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full opacity-[0.12]"
              style={{ background: "radial-gradient(circle, #1B3A6E 0%, transparent 68%)" }}
              aria-hidden
            />
            <div className="relative z-10 mb-6">
              <h2
                className="text-2xl text-[#111827] mb-4"
                style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
              >
                Certificate found
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-[var(--radius-control-sm)] p-4 border border-[#E5E0D8]">
                  <p
                    className="text-xs uppercase text-[#6B7280] mb-1"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                  >
                    Name
                  </p>
                  <p
                    className="text-lg text-[#111827]"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                  >
                    {selected.name}
                  </p>
                </div>
                <div className="bg-white rounded-[var(--radius-control-sm)] p-4 border border-[#E5E0D8]">
                  <p
                    className="text-xs uppercase text-[#6B7280] mb-1"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                  >
                    Class
                  </p>
                  <p
                    className="text-lg text-[#111827]"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                  >
                    {selected.class}
                  </p>
                </div>
                <div className="bg-white rounded-[var(--radius-control-sm)] p-4 border border-[#E5E0D8]">
                  <p
                    className="text-xs uppercase text-[#6B7280] mb-1"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                  >
                    Subject
                  </p>
                  <p
                    className="text-lg text-[#111827]"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                  >
                    {selected.subject}
                  </p>
                </div>
                <div className="bg-white rounded-[var(--radius-control-sm)] p-4 border border-[#E5E0D8]">
                  <p
                    className="text-xs uppercase text-[#6B7280] mb-1"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                  >
                    Score
                  </p>
                  <p
                    className="text-lg text-[#E8720C]"
                    style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
                  >
                    {selected.score}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[var(--radius-control-sm)] p-4 border-2 border-[#E8720C] mb-4">
                <p
                  className="text-xs uppercase text-[#6B7280] mb-2"
                  style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 700 }}
                >
                  Certificate type
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    selected.certificateType === "merit"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                  style={{ fontFamily: "var(--font-nunito-var)" }}
                >
                  {selected.certificateType === "merit" ? "Merit" : "Participation"}
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-2">
              {matches.length > 1 && (
                <Button
                  type="button"
                  variant="secondaryCompact"
                  className="sm:flex-none"
                  onClick={() => setSelected(null)}
                  disabled={downloading}
                >
                  Choose another
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2 py-3"
                onClick={() => void handleDownload(selected)}
                disabled={downloading}
              >
                <Download size={18} aria-hidden />
                {downloading ? "Generating PDF…" : "Download certificate"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
