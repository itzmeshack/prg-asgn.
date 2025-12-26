import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const auction = await prisma.auction.create({
      data: {
        name: body.name,
        date: new Date(body.date),
      },
    });

    return NextResponse.json(auction, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create auction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json(auctions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}
