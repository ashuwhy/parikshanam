/**
 * Reads YMRC CLASS *.docx from public/docs, writes src/lib/ymrc-quiz/quiz-data.json
 * Run from apps/web: node scripts/extract-ymrc-quiz.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const docsDir = path.join(root, "public", "docs");
const outFile = path.join(root, "src", "lib", "ymrc-quiz", "quiz-data.json");

function docxToPlain(xml) {
  return xml
    .replace(/<w:tab[^/]*\/>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDocx(docxPath) {
  const xml = execFileSync("unzip", ["-p", docxPath, "word/document.xml"], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  return docxToPlain(xml);
}

function letterToIndex(letter) {
  const L = letter.trim().toUpperCase();
  if (L === "A") return 0;
  if (L === "B") return 1;
  if (L === "C") return 2;
  if (L === "D") return 3;
  return -1;
}

function parseQuestions(text) {
  const keyIdx = text.indexOf("ANSWER KEY");
  if (keyIdx === -1) throw new Error("No ANSWER KEY in document");
  const body = text.slice(0, keyIdx).trim();
  const keySection = text.slice(keyIdx + "ANSWER KEY".length).trim();

  const answers = {};
  const keyRe = /Q(\d+)\.\s*([A-Da-d])/g;
  let km;
  while ((km = keyRe.exec(keySection)) !== null) {
    answers[Number(km[1])] = letterToIndex(km[2]);
  }

  const chunks = body.split(/\s(?=Q\d+\.)/);
  const questions = [];

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!/^Q\d+\./.test(trimmed)) continue;

    const qNumMatch = trimmed.match(/^Q(\d+)\.\s*(.+)$/s);
    if (!qNumMatch) continue;
    const qn = Number(qNumMatch[1]);
    const rest = qNumMatch[2];

    const splitA = rest.split(/\s\(A\)\s/);
    if (splitA.length < 2) continue;
    const prompt = splitA[0].trim();
    let tail = splitA[1];
    const splitB = tail.split(/\s\(B\)\s/);
    if (splitB.length < 2) continue;
    const optA = splitB[0].trim();
    tail = splitB[1];
    const splitC = tail.split(/\s\(C\)\s/);
    if (splitC.length < 2) continue;
    const optB = splitC[0].trim();
    tail = splitC[1];
    const splitD = tail.split(/\s\(D\)\s/);
    if (splitD.length < 2) continue;
    const optC = splitD[0].trim();
    let optD = splitD[1].trim();
    optD = optD.replace(/\s+Q\d+\.\s*.*$/s, "").trim();

    const correctIndex = answers[qn];
    if (correctIndex === undefined || correctIndex < 0) {
      throw new Error(`Missing answer for Q${qn}`);
    }

    questions.push({
      id: `q${qn}`,
      prompt,
      options: [optA, optB, optC, optD],
      correctIndex,
    });
  }

  questions.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
  return questions;
}

const files = [
  { file: "YMRC CLASS 7.docx", slug: "class-7", label: "Class VII" },
  { file: "YMRC CLASS 8.docx", slug: "class-8", label: "Class VIII" },
  { file: "YMRC CLASS 9.docx", slug: "class-9", label: "Class IX" },
  { file: "YMRC CLASS 10.docx", slug: "class-10", label: "Class X" },
  { file: "YMRC CLASS 11.docx", slug: "class-11", label: "Class XI" },
  { file: "YMRC CLASS 12.docx", slug: "class-12", label: "Class XII" },
];

const quizzes = [];
for (const { file, slug, label } of files) {
  const p = path.join(docsDir, file);
  if (!fs.existsSync(p)) {
    console.error("Missing", p);
    process.exit(1);
  }
  const text = extractDocx(p);
  const questions = parseQuestions(text);
  if (questions.length !== 25) {
    console.error(`${file}: expected 25 questions, got ${questions.length}`);
    process.exit(1);
  }
  quizzes.push({
    slug,
    label,
    subtitle: "YMRC sample paper — Mathematics",
    questions,
  });
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ quizzes }, null, 0), "utf8");
console.log("Wrote", outFile, quizzes.length, "quizzes");
