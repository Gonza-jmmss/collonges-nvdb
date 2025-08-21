import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = process.env.DOCUMENTS_LOCATION || "/app/documents";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

export async function POST(request: NextRequest) {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const savedFiles: any[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} too large. Max 20MB.` },
          { status: 400 },
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      await writeFile(filePath, buffer);

      savedFiles.push({
        fileName,
        originalName: file.name,
        size: file.size,
        type: file.type || "unknown",
      });
    }

    return NextResponse.json({
      message: "Upload successful",
      files: savedFiles,
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: (error as Error).message },
      { status: 500 },
    );
  }
}
