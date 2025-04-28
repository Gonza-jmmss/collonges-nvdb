import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = "C:\\Users\\gjmms\\Documents\\Collonges\\Images";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as string;

    if (!image) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, image);
    await unlink(filePath);

    return NextResponse.json({ filePath });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
