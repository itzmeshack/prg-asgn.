import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lotId } = await request.json();

    const lot = await prisma.lot.findUnique({
      where: { id: Number(lotId) },
    });

    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    if (lot.status !== "SOLD") {
      return NextResponse.json(
        { error: "Only SOLD lots can be archived" },
        { status: 400 }
      );
    }

    const updated = await prisma.lot.update({
      where: { id: Number(lotId) },
      data: {
        archived: true,
        status: "ARCHIVED",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("ARCHIVE LOT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to archive lot" },
      { status: 500 }
    );
  }
}
