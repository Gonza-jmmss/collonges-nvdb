// import { unlink } from "fs/promises";
// import { NextRequest, NextResponse } from "next/server";
// import path from "path";

// // const UPLOAD_DIR = process.env.IMAGES_LOCATION || "";
// const UPLOAD_DIR = "C:\\Users\\gjmms\\Documents\\Collonges\\Images";

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const image = formData.get("image") as string;

//     if (!image) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const filePath = path.join(UPLOAD_DIR, image);
//     await unlink(filePath);

//     return NextResponse.json({ filePath });
//   } catch (error) {
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }

import { unlink, access } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Use environment variable, fallback to container path
const UPLOAD_DIR = process.env.IMAGES_LOCATION || "/app/images";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as string;

    if (!image) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Security: Prevent path traversal attacks
    const fileName = path.basename(image);
    const filePath = path.join(UPLOAD_DIR, fileName);

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
      filePath,
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
