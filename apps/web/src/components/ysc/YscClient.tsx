"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Award, BookOpen, Download, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { YscStudentRecord } from "@/lib/ysc/types";
import { sanitizeDownloadFilePart } from "@/lib/ysc/sanitizeFilename";
import { captureClient } from "@/lib/analytics/capture";
import { AnalyticsEvents } from "@/lib/analytics/events";

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
    captureClient(AnalyticsEvents.ysc_name_search_submitted, {
      query_length: searchName.trim().length,
      match_count: found.length,
    });
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
          class: student.class,
          subject: student.subject,
          score: student.score,
        }),
      });

      if (response.status === 401) {
        toast.error("Please sign in again to download your certificate.");
        return;
      }

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
      captureClient(AnalyticsEvents.ysc_certificate_download_clicked, {
        certificate_type: student.certificateType,
        roll_no: student.rollNo,
      });
      toast.success("Certificate downloaded");
    } catch {
      toast.error("Could not download the certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-6 pb-24 md:pb-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A6E] mb-6 transition-colors"
        style={{ fontFamily: "var(--font-roboto-var)", fontWeight: 500 }}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to dashboard
      </Link>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E8720C]/10 text-[#E8720C] mb-4">
          <Award size={24} strokeWidth={2.25} aria-hidden />
        </div>
        <h1
          className="text-3xl sm:text-4xl text-[#1B3A6E] mb-2"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 900 }}
        >
          YSC certificate download
        </h1>
        <p className="text-[#6B7280] mb-5" style={{ fontFamily: "var(--font-roboto-var)" }}>
          Young Scientist Challenge - APS Kolkata
        </p>

        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] border-2 border-[#1B3A6E] bg-[#1B3A6E] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_0_0_#142952] transition-colors hover:bg-[#234a8a] active:translate-y-[3px] active:shadow-[0_1px_0_0_#142952] motion-reduce:active:translate-y-0"
          style={{ fontFamily: "var(--font-nunito-var)", fontWeight: 800 }}
        >
          <BookOpen size={18} aria-hidden />
          Browse courses in the app
        </Link>
        <p className="mt-3 text-xs text-[#9CA3AF]" style={{ fontFamily: "var(--font-roboto-var)" }}>
          Explore Olympiad and foundation courses after you grab your certificate.
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
            We could not find &quot;{searchName.trim()}&quot; in the YSC records. Check spelling and try your
            full name as registered.
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
            {matches.map((m, index) => (
              <li
                key={`ysc-${index}-${m.rollNo}-${m.class}-${m.subject}-${m.name}-${m.score}-${m.contact}`}
              >
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

          <div className="relative z-10 flex flex-col sm:flex-row sm:flex-nowrap sm:items-stretch gap-2 sm:min-w-0">
            {matches.length > 1 && (
              <Button
                type="button"
                variant="secondaryCompact"
                className={cn(
                  "shrink-0 sm:flex-none sm:min-h-14",
                  "shadow-[0_4px_0_0_#DDD8CF] active:translate-y-[3px] motion-reduce:active:translate-y-0 disabled:active:translate-y-0 active:shadow-[0_1px_0_0_#DDD8CF] disabled:active:shadow-[0_4px_0_0_#DDD8CF]",
                )}
                onClick={() => setSelected(null)}
                disabled={downloading}
              >
                Choose another
              </Button>
            )}
            <Button
              type="button"
              variant="primaryCompact"
              className="w-auto min-w-0 flex-1 min-h-14 flex items-center justify-center gap-2"
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
  );
}
