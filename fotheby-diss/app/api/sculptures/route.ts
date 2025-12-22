import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

// POST: Add sculpture details to an existing lot
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sculpture = await prisma.sculptureDetails.create({
      data: {
        lotNumber: body.lotNumber,
        material: body.material,
        heightCm: body.heightCm,
        lengthCm: body.lengthCm,
        widthCm: body.widthCm,
        weightKg: body.weightKg,
      },
    });

    return NextResponse.json(sculpture, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create sculpture details" },
      { status: 500 }
    );
  }
}
