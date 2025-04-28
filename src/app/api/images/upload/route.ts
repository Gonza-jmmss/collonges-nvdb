import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = "C:\\Users\\gjmms\\Documents\\Collonges\\Images";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ fileName });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
