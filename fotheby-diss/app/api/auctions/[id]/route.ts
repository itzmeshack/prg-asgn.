import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lotId, auctionId } = await request.json();

    const lot = await prisma.lot.findUnique({
      where: { id: lotId },
    });

    if (!lot || lot.status !== "LISTED") {
      return NextResponse.json(
        { error: "Only LISTED lots can be assigned to auctions" },
        { status: 400 }
      );
    }

    const updatedLot = await prisma.lot.update({
      where: { id: lotId },
      data: {
        auctionId,
      },
    });

    return NextResponse.json(updatedLot);
  } catch {
    return NextResponse.json(
      { error: "Failed to assign lot to auction" },
      { status: 500 }
    );
  }
}
