import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lotId, auctionId, force } = await request.json();

    const lot = await prisma.lot.findUnique({
      where: { id: Number(lotId) },
      include: { auction: true },
    });

    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    // Lot already assigned and no force flag
    if (lot.auctionId && !force) {
      return NextResponse.json(
        {
          needsConfirmation: true,
          currentAuction: {
            id: lot.auction?.id,
            name: lot.auction?.name,
          },
        },
        { status: 409 }
      );
    }

    const updatedLot = await prisma.lot.update({
      where: { id: Number(lotId) },
      data: {
        auctionId: Number(auctionId),
      },
    });

    return NextResponse.json(updatedLot);
  } catch (error) {
    console.error("ASSIGN LOT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to assign lot" },
      { status: 500 }
    );
  }
}
