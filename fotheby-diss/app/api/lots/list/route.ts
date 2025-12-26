import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lotId } = await request.json();

    const lot = await prisma.lot.update({
      where: { id: Number(lotId) },
      data: { status: "LISTED" },
    });

    return NextResponse.json(lot);
  } catch {
    return NextResponse.json(
      { error: "Failed to list lot" },
      { status: 500 }
    );
  }
}
