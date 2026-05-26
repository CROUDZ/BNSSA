import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const PDF_MAP: Record<string, string> = {
  "1": "qcm1.pdf",
  "2": "qcm2.pdf",
  "3": "qcm3.pdf",
  "4": "qcm4.pdf",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) {
  const params = await context.params;
  const id = params?.id;
  const filename = PDF_MAP[
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : ""
  ];
  if (!filename) {
    return NextResponse.json({ error: "QCM introuvable" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "src", "data", filename);

  try {
    const file = await readFile(filePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "PDF indisponible" },
      { status: 404 },
    );
  }
}
