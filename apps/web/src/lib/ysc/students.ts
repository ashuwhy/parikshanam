import fs from "fs";
import path from "path";

import type { YscCertificateType, YscStudentRecord } from "@/lib/ysc/types";

/**
 * Explicit merit recipients (APS Kolkata YSC). Everyone else gets participation.
 * Key: normalized name | class | subject (subject uppercased).
 */
const YSC_MERIT_ROW_KEYS = new Set<string>([
  "ANKUR DAS|7|SCIENCE",
  "AYUSMIT GHOSH|7|SCIENCE",
  "RYAN MICHAEL|7|SCIENCE",
  "AKSHIT SHARMA|8|SCIENCE",
  "SARTHAK CHAKARBORTY|8|SCIENCE",
  "SUBHRABARAN MAJUMDAR|8|SCIENCE",
  "ANINDITA KHATUA|9|SCIENCE",
  "DIPESH DAS|9|SCIENCE",
  "NIRJHAR CHAKARBORTY|9|SCIENCE",
  "SRIJINA PAL|9|SCIENCE",
  "SUSHRITA SINGHA|9|SCIENCE",
  "NIRJHAR CHAKRABORTY|9|MATHS",
  "NIYATI JOIS|9|MATHS",
]);

export const YSC_CSV_FILENAMES = [
  "20260203_YSC_APS_Kolkata - CLASS 6.csv",
  "20260203_YSC_APS_Kolkata - CLASS 7.csv",
  "20260203_YSC_APS_Kolkata - CLASS 8.csv",
  "20260203_YSC_APS_Kolkata - CLASS 9.csv",
  "20260203_YSC_APS_Kolkata - CLASS 9 MATHS.csv",
] as const;

export type { YscCertificateType, YscStudentRecord };

function normalizeNameKey(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, " ");
}

function yscMeritRowKey(name: string, cls: string, subject: string): string {
  return `${normalizeNameKey(name)}|${cls.trim()}|${subject.trim().toUpperCase()}`;
}

export function certificateTypeForYscRow(
  name: string,
  cls: string,
  subject: string,
): YscCertificateType {
  return YSC_MERIT_ROW_KEYS.has(yscMeritRowKey(name, cls, subject))
    ? "merit"
    : "participation";
}

/** Split a single CSV row on commas (fields are not quoted in YSC exports). */
function splitCsvRow(line: string): string[] {
  return line.split(",").map((cell) => cell.trim());
}

const EXPECTED_HEADERS = ["name", "roll no", "contact", "score", "class", "subject"];

function parseYscCsv(text: string): YscStudentRecord[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headerCells = splitCsvRow(lines[0]!).map((h) => h.toLowerCase());
  const headerOk =
    headerCells.length >= 6 &&
    EXPECTED_HEADERS.every((h, i) => headerCells[i] === h);
  if (!headerOk) {
    throw new Error(
      `Unexpected YSC CSV header: got [${headerCells.join(", ")}], expected [${EXPECTED_HEADERS.join(", ")}]`,
    );
  }

  const records: YscStudentRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvRow(lines[i]!);
    if (cells.length < 6) continue;
    const [name, rollNo, contact, score, cls, subject] = cells;
    if (!name) continue;
    records.push({
      name,
      rollNo: rollNo ?? "",
      contact: contact ?? "",
      score: score ?? "",
      class: cls ?? "",
      subject: subject ?? "",
      certificateType: certificateTypeForYscRow(name, cls ?? "", subject ?? ""),
    });
  }
  return records;
}

export function loadAllYscStudents(): YscStudentRecord[] {
  const dir = path.join(process.cwd(), "public", "csv");
  const all: YscStudentRecord[] = [];
  for (const file of YSC_CSV_FILENAMES) {
    const fp = path.join(dir, file);
    const text = fs.readFileSync(fp, "utf8");
    all.push(...parseYscCsv(text));
  }
  return all;
}

export function findStudentsByNameQuery(
  students: YscStudentRecord[],
  query: string,
): YscStudentRecord[] {
  const q = normalizeNameKey(query);
  if (!q) return [];
  return students.filter((s) => normalizeNameKey(s.name).includes(q));
}

/**
 * Resolve a student row for certificate generation. When roll + name match more than one row
 * (e.g. same roll in multiple subjects), pass class, subject, and score to pick the exact row.
 */
export function findStudentForCertificate(
  students: YscStudentRecord[],
  params: {
    rollNo: string;
    name: string;
    class?: string;
    subject?: string;
    score?: string;
  },
): YscStudentRecord | undefined {
  const r = params.rollNo.trim();
  const n = normalizeNameKey(params.name);
  if (!r || !n) return undefined;

  const byRollName = students.filter(
    (s) => s.rollNo.trim() === r && normalizeNameKey(s.name) === n,
  );
  if (byRollName.length === 0) return undefined;
  if (byRollName.length === 1) return byRollName[0];

  const cls = params.class?.trim();
  const subj = params.subject?.trim();
  const score = params.score?.trim();
  if (cls !== undefined && subj !== undefined && score !== undefined) {
    const exact = byRollName.find(
      (s) =>
        s.class.trim() === cls &&
        s.subject.trim() === subj &&
        s.score.trim() === score,
    );
    if (exact) return exact;
  }

  return byRollName[0];
}
