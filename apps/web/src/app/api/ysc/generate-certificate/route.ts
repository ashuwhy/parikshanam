import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

import { sanitizeDownloadFilePart } from "@/lib/ysc/sanitizeFilename";
import {
  certificateTypeForYscRow,
  findStudentForCertificate,
  loadAllYscStudents,
} from "@/lib/ysc/students";

/** Merit / participation layout PDFs in public/pdfs (update if filenames change). */
const YSC_TEMPLATE_FILES = {
  merit: "YSC Merit certificate_20260328_223742_0000.pdf",
  participation: "YSC Participation certificate_20260328_223712_0000.pdf",
} as const;

/**
 * Name placement (PDF origin bottom-left; lower ratio = lower on page).
 * Tuned so the name sits below “THIS CERTIFICATE IS GIVEN TO”, not on top of it.
 */
const NAME_FONT_SIZE = 22;
const NAME_Y_RATIO = 0.44;

/** Nunito Black (900) - matches site headings; variable Nunito TTF embeds as ExtraLight in pdf-lib. */
const NUNITO_BLACK_PATH = path.join(
  process.cwd(),
  "public",
  "fonts",
  "Nunito-Black.ttf",
);

type Body = {
  rollNo?: string;
  name?: string;
  /** Disambiguate when the same roll + name appears on multiple rows (e.g. multiple subjects). */
  class?: string;
  subject?: string;
  score?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const rollNo = typeof body.rollNo === "string" ? body.rollNo : "";
    const name = typeof body.name === "string" ? body.name : "";
    const cls = typeof body.class === "string" ? body.class : undefined;
    const subject = typeof body.subject === "string" ? body.subject : undefined;
    const score = typeof body.score === "string" ? body.score : undefined;
    if (!rollNo.trim() || !name.trim()) {
      return NextResponse.json({ error: "Missing roll number or name" }, { status: 400 });
    }

    const students = loadAllYscStudents();
    const row = findStudentForCertificate(students, {
      rollNo,
      name,
      class: cls,
      subject,
      score,
    });
    if (!row) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const certificateType = certificateTypeForYscRow(row.name, row.class, row.subject);
    const templateFile = YSC_TEMPLATE_FILES[certificateType];
    const templatePath = path.join(process.cwd(), "public", "pdfs", templateFile);

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: "Certificate template missing" }, { status: 500 });
    }

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);

    if (!fs.existsSync(NUNITO_BLACK_PATH)) {
      return NextResponse.json({ error: "Certificate font missing" }, { status: 500 });
    }
    const nunitoBytes = fs.readFileSync(NUNITO_BLACK_PATH);
    const font = await pdfDoc.embedFont(nunitoBytes);

    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();
    const displayName = row.name.toUpperCase();
    const textWidth = font.widthOfTextAtSize(displayName, NAME_FONT_SIZE);
    const x = Math.max(0, (width - textWidth) / 2);
    const y = height * NAME_Y_RATIO;

    page.drawText(displayName, {
      x,
      y,
      size: NAME_FONT_SIZE,
      font,
      color: rgb(27 / 255, 58 / 255, 110 / 255),
    });

    pdfDoc.setTitle(`YSC ${certificateType} certificate - ${row.name}`);
    pdfDoc.setAuthor("Parikshanam - YSC");
    pdfDoc.setSubject(`${certificateType} certificate for ${row.name} (${row.subject}, Class ${row.class})`);

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);
    const safe = sanitizeDownloadFilePart(row.name);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="YSC-${certificateType}-${safe}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
  }
}
