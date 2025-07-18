import { unlink, access } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = process.env.IMAGES_LOCATION || "/app/images";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as string;

    if (!image) {
      return NextResponse.json(
        { error: "No image name provided" },
        { status: 400 },
      );
    }

    // Security: Prevent path traversal attacks
    const fileName = path.basename(image);

    // Additional security: ensure filename doesn't contain suspicious patterns
    if (
      fileName.includes("..") ||
      fileName.includes("/") ||
      fileName.includes("\\")
    ) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, fileName);

    // Ensure the resolved path is still within UPLOAD_DIR
    if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Check if file exists before trying to delete
    try {
      await access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await unlink(filePath);

    console.log(`Image deleted: ${fileName} from ${filePath}`);

    return NextResponse.json({
      message: "Delete successful",
      fileName,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        error: "Delete failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
