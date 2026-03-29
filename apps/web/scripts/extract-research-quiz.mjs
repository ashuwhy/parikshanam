/**
 * Reads YMRC / YSRC sample papers from public/docs (*.docx), extracts MCQs + ANSWER KEY,
 * writes src/lib/research-quizzes/quiz-data.json (pretty-printed).
 *
 * Run from apps/web: node scripts/extract-research-quiz.mjs
 *
 * Handles three option formats without data loss:
 *   Format 1 — parenthesis : (A) opt  (B) opt  (C) opt  (D) opt       [all YMRC + YSRC 7/8/10/11/12]
 *   Format 2 — dot         :  A. opt   B. opt   C. opt   D. opt        [YSRC CLASS 9, all Qs except Q13]
 *   Format 3 — keyword     :  Option X  Option X  Option X  Option X   [YSRC CLASS 9, Q13 only]
 *
 * YSRC CLASS 9 Q4, Q5, Q15, Q22: some blocks lack A./(A) labels in the Word export; normalizeYsrcClass9UnlabeledOptions
 * injects (A)–(D). Q15 trailing empty E. (if present) is stripped in cleanLastOption; Q22 keeps lowercase “because” inside option (A).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const docsDir = path.join(root, "public", "docs");
const outFile = path.join(root, "src", "lib", "research-quizzes", "quiz-data.json");

// ── raw-text extraction ───────────────────────────────────────────────────────

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
    maxBuffer: 20 * 1024 * 1024,
  });
  return docxToPlain(xml);
}

// ── utilities ─────────────────────────────────────────────────────────────────

function letterToIndex(letter) {
  return { A: 0, B: 1, C: 2, D: 3 }[letter.trim().toUpperCase()] ?? -1;
}

/**
 * Strip trailing E-option artefact or next-question spillover from the raw D-option text.
 * Preserves every character of the actual D option (including lowercase letters).
 */
function cleanLastOption(raw) {
  return raw
    .replace(/\s*\(E\)[\s\S]*$/, "") // (E) and beyond
    .replace(/\s+E\.\s*[\s\S]*$/, "") //  E. and beyond  (YSRC-9 Q15)
    .replace(/\s+Q\d+\.\s[\s\S]*$/, "") // next Qn spillover (safety)
    .trim();
}

// ── answer-key parser ─────────────────────────────────────────────────────────

function parseAnswerKey(text) {
  const keyIdx = text.search(/\bANSWER KEY\b/i);
  if (keyIdx === -1) return null;
  const keySection = text.slice(keyIdx);
  const answers = {};
  const re = /Q(\d+)\.\s*([A-Da-d])/g;
  let m;
  while ((m = re.exec(keySection)) !== null) {
    answers[Number(m[1])] = letterToIndex(m[2]);
  }
  return answers;
}

// ── option parsers (three strategies) ────────────────────────────────────────

/**
 * Strategy 1 — (A) (B) (C) (D) parenthesis format.
 * Non-greedy capture handles options that run together without newlines
 * (common in YSRC 10, 11, 12 after XML flattening).
 */
function tryParenFormat(rest) {
  const m = rest.match(
    /^([\s\S]*?)\s*\(A\)\s*([\s\S]*?)\s*\(B\)\s*([\s\S]*?)\s*\(C\)\s*([\s\S]*?)\s*\(D\)\s*([\s\S]*)$/,
  );
  if (!m) return null;
  const prompt = m[1].trim();
  const optA = m[2].trim();
  const optB = m[3].trim();
  const optC = m[4].trim();
  const optD = cleanLastOption(m[5]);
  if (prompt && optA && optB && optC && optD) {
    return { prompt, options: [optA, optB, optC, optD] };
  }
  return null;
}

/**
 * Strategy 2 — A.  B.  C.  D. dot format.
 * Used throughout YSRC CLASS 9 (except Q13).
 * Requires at least one whitespace character before each letter label to
 * avoid false matches on "A black hole…" at the start of rest.
 */
function tryDotFormat(rest) {
  const m = rest.match(
    /^([\s\S]*?)\s+A\.\s+([\s\S]*?)\s+B\.\s+([\s\S]*?)\s+C\.\s+([\s\S]*?)\s+D\.\s+([\s\S]*)$/,
  );
  if (!m) return null;
  const prompt = m[1].trim();
  const optA = m[2].trim();
  const optB = m[3].trim();
  const optC = m[4].trim();
  const optD = cleanLastOption(m[5]);
  if (prompt && optA && optB && optC) {
    return { prompt, options: [optA, optB, optC, optD] };
  }
  return null;
}

/**
 * Strategy 3 — "Option X" keyword format.
 * Used only in YSRC CLASS 9 Q13, where option labels are the word "Option"
 * followed by the numeric value (e.g. "Option 0.15").
 */
function tryOptionKeywordFormat(rest) {
  const m = rest.match(
    /^([\s\S]*?)\s+Option\s+(\S+)\s+Option\s+(\S+)\s+Option\s+(\S+)\s+Option\s+(\S+)/i,
  );
  if (!m) return null;
  return {
    prompt: m[1].trim(),
    options: [m[2], m[3], m[4], m[5]],
  };
}

function parseQuestionContent(rest) {
  return tryParenFormat(rest) ?? tryDotFormat(rest) ?? tryOptionKeywordFormat(rest);
}

// ── question-block parser ─────────────────────────────────────────────────────

function parseQuestions(text, sourceLabel) {
  const keyIdx = text.search(/\bANSWER KEY\b/i);
  if (keyIdx === -1) throw new Error(`${sourceLabel}: ANSWER KEY section not found`);

  const body = text.slice(0, keyIdx).trim();
  const answers = parseAnswerKey(text);
  if (!answers || !Object.keys(answers).length) {
    throw new Error(`${sourceLabel}: answer key parsed 0 entries`);
  }

  // Split at every " Q<n>." boundary to isolate question blocks.
  const chunks = body.split(/\s(?=Q\d+\.)/);
  const questions = [];

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!/^Q\d+\./.test(trimmed)) continue;

    const head = trimmed.match(/^Q(\d+)\.\s*([\s\S]+)$/);
    if (!head) continue;

    const qn = Number(head[1]);
    const rest = head[2];

    const parsed = parseQuestionContent(rest);
    if (!parsed) {
      throw new Error(`${sourceLabel}: no option pattern matched for Q${qn}`);
    }

    const correctIndex = answers[qn];
    if (correctIndex === undefined || correctIndex < 0) {
      throw new Error(`${sourceLabel}: missing or invalid answer key entry for Q${qn}`);
    }

    questions.push({
      id: `q${qn}`,
      prompt: parsed.prompt,
      options: parsed.options,
      correctIndex,
    });
  }

  // Ensure canonical order regardless of document ordering.
  questions.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));

  const expected = Object.keys(answers).length;
  if (questions.length !== expected) {
    throw new Error(
      `${sourceLabel}: extracted ${questions.length} Qs but answer key has ${expected} entries`,
    );
  }

  return questions;
}

// ── YSRC CLASS 9: Q4 & Q5 have no A./(A) labels in the Word export ───────────
// (only those two; the rest match dot- or Option-keyword format.)

function normalizeYsrcClass9UnlabeledOptions(text) {
  return text
    .replace(
      /\? Black holes have no gravity because matter disappears completely inside them Black holes attract planets but cannot affect light The gravity of a black hole is so strong that even light cannot escape beyond the event horizon Black holes are giant empty holes filled with gases /,
      "? (A) Black holes have no gravity because matter disappears completely inside them (B) Black holes attract planets but cannot affect light (C) The gravity of a black hole is so strong that even light cannot escape beyond the event horizon (D) Black holes are giant empty holes filled with gases ",
    )
    .replace(
      /\? Its carbon atoms are radioactive Its honeycomb structure creates a linear energy-momentum relation for electrons Its thickness prevents electrons from colliding Its electrons are trapped permanently in chemical bonds /,
      "? (A) Its carbon atoms are radioactive (B) Its honeycomb structure creates a linear energy-momentum relation for electrons (C) Its thickness prevents electrons from colliding (D) Its electrons are trapped permanently in chemical bonds ",
    )
    .replace(
      /\? Because the signal may still arise from statistical fluctuations when many possible mass ranges are examined Because 4σ is weaker than 2σ Because all discoveries require direct visual observation Because significance values greater than 3σ are unreliable/,
      "? (A) Because the signal may still arise from statistical fluctuations when many possible mass ranges are examined (B) Because 4σ is weaker than 2σ (C) Because all discoveries require direct visual observation (D) Because significance values greater than 3σ are unreliable",
    )
    .replace(
      /\? because false positives can outnumber true positives when the disease is extremely rare Because sensitivity is more important than specificity Because rare diseases cannot be detected accurately Because high specificity makes all positive results unreliable/,
      "? (A) because false positives can outnumber true positives when the disease is extremely rare (B) Because sensitivity is more important than specificity (C) Because rare diseases cannot be detected accurately (D) Because high specificity makes all positive results unreliable",
    );
}

// ── quiz builder ──────────────────────────────────────────────────────────────

function buildQuizzes(specs, subtitle, sourceTag) {
  return specs.map(({ file, slug, label }) => {
    const p = path.join(docsDir, file);
    if (!fs.existsSync(p)) throw new Error(`Missing file: ${p}`);
    let text = extractDocx(p);
    if (file === "YSRC CLASS 9.docx") {
      text = normalizeYsrcClass9UnlabeledOptions(text);
    }
    const questions = parseQuestions(text, `${sourceTag} ${file}`);
    return { slug, label, subtitle, questionCount: questions.length, questions };
  });
}

// ── file specs ────────────────────────────────────────────────────────────────

const YMRC_SPECS = [
  { file: "YMRC CLASS 7.docx", slug: "class-7", label: "Class VII" },
  { file: "YMRC CLASS 8.docx", slug: "class-8", label: "Class VIII" },
  { file: "YMRC CLASS 9.docx", slug: "class-9", label: "Class IX" },
  { file: "YMRC CLASS 10.docx", slug: "class-10", label: "Class X" },
  { file: "YMRC CLASS 11.docx", slug: "class-11", label: "Class XI" },
  { file: "YMRC CLASS 12.docx", slug: "class-12", label: "Class XII" },
];

const YSRC_SPECS = [
  { file: "YSRC CLASS 7.docx", slug: "class-7", label: "Class VII" },
  { file: "YSRC CLASS 8.docx", slug: "class-8", label: "Class VIII" },
  { file: "YSRC CLASS 9.docx", slug: "class-9", label: "Class IX" },
  { file: "YSRC CLASS 10.docx", slug: "class-10", label: "Class X" },
  { file: "YSRC CLASS 11 (1).docx", slug: "class-11", label: "Class XI" },
  { file: "YSRC CLASS 12 (2).docx", slug: "class-12", label: "Class XII" },
];

// ── main ──────────────────────────────────────────────────────────────────────

const output = {
  version: 1,
  generatedAt: new Date().toISOString(),
  ymrc: {
    id: "ymrc",
    name: "Young Mathematical Research Challenge",
    abbr: "YMRC",
    subject: "Mathematics",
    quizzes: buildQuizzes(YMRC_SPECS, "YMRC sample paper — Mathematics", "YMRC"),
  },
  ysrc: {
    id: "ysrc",
    name: "Young Scientific Research Challenge",
    abbr: "YSRC",
    subject: "Science",
    quizzes: buildQuizzes(YSRC_SPECS, "YSRC sample paper — Science", "YSRC"),
  },
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

const ymrcN = output.ymrc.quizzes.reduce((s, q) => s + q.questions.length, 0);
const ysrcN = output.ysrc.quizzes.reduce((s, q) => s + q.questions.length, 0);
console.log("✅ Wrote", outFile);
console.log(`   YMRC: ${output.ymrc.quizzes.length} papers, ${ymrcN} questions`);
console.log(`   YSRC: ${output.ysrc.quizzes.length} papers, ${ysrcN} questions`);
