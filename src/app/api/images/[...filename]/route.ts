import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import mime from "mime-types";

const UPLOAD_DIR = "C:\\Users\\gjmms\\Documents\\Collonges\\Images";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string[] } },
) {
  try {
    const filename = params.filename.join("/");
    const filePath = path.join(UPLOAD_DIR, filename);
    const imageBuffer = await readFile(filePath);
    const contentType = mime.lookup(filename) || "application/octet-stream";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
