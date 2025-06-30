// import { writeFile } from "fs/promises";
// import { NextRequest, NextResponse } from "next/server";
// import path from "path";

// // const UPLOAD_DIR = process.env.IMAGES_LOCATION || "";
// const UPLOAD_DIR = "C:\\Users\\gjmms\\Documents\\Collonges\\Images";

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(UPLOAD_DIR, fileName);

//     await writeFile(filePath, buffer);

//     return NextResponse.json({ fileName });
//   } catch (error) {
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Use environment variable, fallback to container path
const UPLOAD_DIR = process.env.IMAGES_LOCATION || "/app/images";

export async function POST(request: NextRequest) {
  try {
    // Ensure the upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (optional security measure)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await writeFile(filePath, buffer);

    console.log(`Image uploaded: ${fileName} to ${filePath}`);

    return NextResponse.json({
      fileName,
      message: "Upload successful",
      path: filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
