// import { NextRequest, NextResponse } from "next/server";
// import { readFile } from "fs/promises";
// import path from "path";
// import mime from "mime-types";

// // const UPLOAD_DIR = process.env.IMAGES_LOCATION || "";
// const UPLOAD_DIR = "C:\\Users\\gjmms\\Documents\\Collonges\\Images";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { filename: string[] } },
// ) {
//   try {
//     const filename = params.filename.join("/");
//     const filePath = path.join(UPLOAD_DIR, filename);
//     const imageBuffer = await readFile(filePath);
//     const contentType = mime.lookup(filename) || "application/octet-stream";

//     return new NextResponse(imageBuffer, {
//       headers: {
//         "Content-Type": contentType,
//         "Cache-Control": "public, max-age=31536000",
//       },
//     });
//   } catch (error) {
//     console.error("Image fetch error:", error);
//     return NextResponse.json({ error: "Image not found" }, { status: 404 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import path from "path";
import mime from "mime-types";

// Use environment variable, fallback to container path
const UPLOAD_DIR = process.env.IMAGES_LOCATION || "/app/images";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string[] } },
) {
  try {
    const filename = params.filename.join("/");

    // Security: Prevent path traversal attacks
    const safePath = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(UPLOAD_DIR, safePath);

    // Ensure the resolved path is still within UPLOAD_DIR
    if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Check if file exists
    try {
      await access(filePath);
    } catch {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageBuffer = await readFile(filePath);
    const contentType = mime.lookup(filename) || "application/octet-stream";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return NextResponse.json(
      {
        error: "Image not found",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 404 },
    );
  }
}
