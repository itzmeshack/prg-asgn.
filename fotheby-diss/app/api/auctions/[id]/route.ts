import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const auctionId = Number(id);

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 5);
  const skip = (page - 1) * pageSize;

  const [auction, total] = await Promise.all([
    prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        lots: {
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.lot.count({ where: { auctionId } }),
  ]);

  if (!auction) {
    return NextResponse.json({ error: "Auction not found" }, { status: 404 });
  }

  return NextResponse.json({
    auction,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}
