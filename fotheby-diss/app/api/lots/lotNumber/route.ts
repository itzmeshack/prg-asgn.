import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch single lot by lotNumber
export async function GET(
  request: Request,
  { params }: { params: { lotNumber: string } }
) {
  try {
    const lot = await prisma.lot.findUnique({
      where: { lotNumber: params.lotNumber },
    });

    if (!lot || lot.archived) {
      return NextResponse.json(
        { error: "Lot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lot);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch lot" },
      { status: 500 }
    );
  }
}

// PUT: Update lot details
export async function PUT(
  request: Request,
  { params }: { params: { lotNumber: string } }
) {
  try {
    const body = await request.json();

    const updatedLot = await prisma.lot.update({
      where: { lotNumber: params.lotNumber },
      data: {
        artistName: body.artistName,
        yearProduced: body.yearProduced,
        subject: body.subject,
        description: body.description,
        estimatedPrice: body.estimatedPrice,
        category: body.category,
        status: body.status,
      },
    });

    return NextResponse.json(updatedLot);
  } catch {
    return NextResponse.json(
      { error: "Failed to update lot" },
      { status: 500 }
    );
  }
}

// DELETE: Archive lot (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { lotNumber: string } }
) {
  try {
    await prisma.lot.update({
      where: { lotNumber: params.lotNumber },
      data: { archived: true, status: "ARCHIVED" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to archive lot" },
      { status: 500 }
    );
  }
}
