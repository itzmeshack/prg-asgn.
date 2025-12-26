import { prisma } from "../../../../lib/prisma";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ lotNumber: string }> }
) {
  try {
    // ✅ UNWRAP params (this is the key fix)
    const { lotNumber } = await context.params;

    console.log("Requested lotNumber:", lotNumber);

   const lot = await prisma.lot.findUnique({
  where: {
    lotNumber,
  },
  include: {
    images: true,
  },
});


    if (!lot) {
      return NextResponse.json(
        { error: "Lot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lot);
  } catch (error) {
    console.error("GET /api/lots/[lotNumber] error:", error);

    return NextResponse.json(
      { error: "Failed to fetch lot" },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: Request,
  context: { params: Promise<{ lotNumber: string }> }
) {
  try {
    const { lotNumber } = await context.params;
    const data = await request.json();

    const updatedLot = await prisma.lot.update({
      where: { lotNumber },
      data,
    });

    return NextResponse.json(updatedLot);
  } catch (error) {
    console.error("PUT /api/lots/[lotNumber] error:", error);

    return NextResponse.json(
      { error: "Failed to update lot" },
      { status: 500 }
    );
  }
}
