import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

// POST: Add painting details to an existing lot
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const painting = await prisma.paintingDetails.create({
      data: {
        lotNumber: body.lotNumber,
        medium: body.medium,
        framed: body.framed,
        heightCm: body.heightCm,
        lengthCm: body.lengthCm,
      },
    });

    return NextResponse.json(painting, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create painting details" },
      { status: 500 }
    );
  }
}
