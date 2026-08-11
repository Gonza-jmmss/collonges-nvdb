// import { NextRequest, NextResponse } from "next/server";
// import { readFile, access, stat } from "fs/promises";
// import path from "path";
// import mime from "mime-types";

// const UPLOAD_DIR = process.env.IMAGES_LOCATION || "/app/images";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { filename: string[] } },
// ) {
//   try {
//     const filename = params.filename.join("/");

//     // Security: Prevent path traversal attacks
//     const safePath = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");

//     // Additional security check
//     if (safePath.includes("..") || safePath.includes("\\")) {
//       return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
//     }

//     const filePath = path.join(UPLOAD_DIR, safePath);

//     // Ensure the resolved path is still within UPLOAD_DIR
//     if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
//       return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
//     }

//     // Check if file exists
//     try {
//       await access(filePath);
//     } catch {
//       return NextResponse.json({ error: "Image not found" }, { status: 404 });
//     }

//     // Get file stats for Content-Length
//     const stats = await stat(filePath);
//     const imageBuffer = await readFile(filePath);
//     const contentType = mime.lookup(filename) || "application/octet-stream";

//     // Validate that it's actually an image
//     if (!contentType.startsWith("image/")) {
//       return NextResponse.json(
//         { error: "File is not an image" },
//         { status: 400 },
//       );
//     }

//     return new NextResponse(imageBuffer.toString(), {
//       headers: {
//         "Content-Type": contentType,
//         "Content-Length": stats.size.toString(),
//         "Cache-Control": "public, max-age=31536000, immutable",
//         ETag: `"${stats.mtime.getTime()}-${stats.size}"`,
//       },
//     });
//   } catch (error) {
//     console.error("Image fetch error:", error);
//     return NextResponse.json(
//       {
//         error: "Image not found",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 404 },
//     );
//   }
// }

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

    // Security: Prevent path traversal attacks
    const safePath = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");

    if (safePath.includes("..") || safePath.includes("\\")) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, safePath);

    // Ensure the resolved path is still within UPLOAD_DIR
    if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Check if file exists
    try {
      await access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Get file stats and read file
    const stats = await stat(filePath);
    const fileBuffer = await readFile(filePath);
    const contentType = mime.lookup(filename) || "application/octet-stream";

    // Return the buffer directly (not converted to string!)
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Content-Disposition": `inline; filename="${path.basename(filename)}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"${stats.mtime.getTime()}-${stats.size}"`,
      },
    });
  } catch (error) {
    console.error("File fetch error:", error);
    return NextResponse.json(
      {
        error: "File not found",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 404 },
    );
  }
}
