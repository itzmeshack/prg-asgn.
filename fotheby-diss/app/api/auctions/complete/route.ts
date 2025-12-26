import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { auctionId } = await request.json();

    const auction = await prisma.auction.update({
      where: { id: Number(auctionId) },
      data: {
        status: "COMPLETED",
        lots: {
          updateMany: {
            where: { status: "LISTED" },
            data: { status: "SOLD" },
          },
        },
      },
      include: { lots: true },
    });

    return NextResponse.json(auction);
  } catch (error) {
    console.error("COMPLETE AUCTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to complete auction" },
      { status: 500 }
    );
  }
}
