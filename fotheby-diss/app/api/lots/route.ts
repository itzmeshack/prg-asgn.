import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const artist = searchParams.get("artist");
  const category = searchParams.get("category");
  const subject = searchParams.get("subject");

  try {
    const lots = await prisma.lot.findMany({
      where: {
        archived: false,
        artistName: artist ? { contains: artist } : undefined,
        category: category ?? undefined,
        subject: subject ?? undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(lots);
  } catch {
    return NextResponse.json(
      { error: "Failed to search lots" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lot = await prisma.lot.create({
      data: {
        lotNumber: body.lotNumber,
        artistName: body.artistName,
        yearProduced: body.yearProduced,
        subject: body.subject,
        description: body.description,
        estimatedPrice: body.estimatedPrice,
        category: body.category,
      },
    });

    return NextResponse.json(lot, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create lot" },
      { status: 500 }
    );
  }
}


