import fs from "fs";
import path from "path";

import type { YscCertificateType, YscStudentRecord } from "@/lib/ysc/types";

/** Scores at or above this value receive the merit certificate template. */
export const YSC_MERIT_SCORE_THRESHOLD = 15;

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

function parseScoreNumber(score: string): number {
  const n = Number.parseInt(score.trim(), 10);
  return Number.isFinite(n) ? n : NaN;
}

export function certificateTypeFromScore(
  score: string,
  threshold: number = YSC_MERIT_SCORE_THRESHOLD,
): YscCertificateType {
  const n = parseScoreNumber(score);
  if (!Number.isFinite(n)) return "participation";
  return n >= threshold ? "merit" : "participation";
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
      certificateType: certificateTypeFromScore(score ?? ""),
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

export function findStudentByRollAndName(
  students: YscStudentRecord[],
  rollNo: string,
  name: string,
): YscStudentRecord | undefined {
  const r = rollNo.trim();
  const n = normalizeNameKey(name);
  if (!r || !n) return undefined;
  return students.find(
    (s) => s.rollNo.trim() === r && normalizeNameKey(s.name) === n,
  );
}
