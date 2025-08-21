import { NextRequest, NextResponse } from "next/server";
import { readFile, access, stat } from "fs/promises";
import path from "path";
import mime from "mime-types";

const UPLOAD_DIR = process.env.DOCUMENTS_LOCATION || "/app/documents";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string[] } },
) {
  try {
    const filename = params.filename.join("/");
    const safePath = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");

    if (safePath.includes("..") || safePath.includes("\\")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, safePath);

    if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    try {
      await access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stats = await stat(filePath);
    const buffer = await readFile(filePath);
    const contentType = mime.lookup(filename) || "application/octet-stream";

    return new NextResponse(buffer.toString(), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Content-Disposition": `inline; filename="${path.basename(filename)}"`,
      },
    });
  } catch (error) {
    console.error("Document fetch error:", error);
    return NextResponse.json(
      { error: "Fetch failed", details: (error as Error).message },
      { status: 500 },
    );
  }
}
