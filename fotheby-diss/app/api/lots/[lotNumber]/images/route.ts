import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(
  request: Request,
  context: { params: Promise<{ lotNumber: string }> }
) {
  try {
    const { lotNumber } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "lots",
      lotNumber
    );

    fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    await prisma.lotImage.create({
      data: {
        lotNumber,
        filename,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}
