import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lots = await prisma.lot.findMany({
      where: {
        archived: true,
        status: "ARCHIVED",
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(lots);
  } catch (error) {
    console.error("FETCH ARCHIVED LOTS ERROR:", error);
    return NextResponse.json([], { status: 200 });
  }
}
