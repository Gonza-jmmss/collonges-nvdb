import { unlink, access } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = process.env.DOCUMENTS_LOCATION || "/app/documents";

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json(); // expect { files: string[] }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const deleted: string[] = [];
    const notFound: string[] = [];

    for (const fileName of files) {
      const safeName = path.basename(fileName);
      const filePath = path.join(UPLOAD_DIR, safeName);

      if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
      }

      try {
        await access(filePath);
        await unlink(filePath);
        deleted.push(safeName);
      } catch {
        notFound.push(safeName);
      }
    }

    return NextResponse.json({
      message: "Delete finished",
      deleted,
      notFound,
    });
  } catch (error) {
    console.error("Document delete error:", error);
    return NextResponse.json(
      { error: "Delete failed", details: (error as Error).message },
      { status: 500 },
    );
  }
}
