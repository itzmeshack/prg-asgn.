import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      where: { archived: false },
      include: {
        _count: {
          select: { lots: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.error("FETCH AUCTIONS ERROR:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Auction name is required" },
        { status: 400 }
      );
    }

    const auction = await prisma.auction.create({
      data: {
        name: body.name,
        auctionDate: body.auctionDate
          ? new Date(body.auctionDate)
          : null,
      },
    });

    return NextResponse.json(auction, { status: 201 });
  } catch (error) {
    console.error("CREATE AUCTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create auction" },
      { status: 500 }
    );
  }
}
