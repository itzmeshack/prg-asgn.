import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const subject = searchParams.get("subject")?.trim();
    const status = searchParams.get("status")?.trim(); // ✅ ADD THIS

    const where: any = {
      archived: false,
    };

    // SEARCH
    if (q) {
      where.OR = [
        { artistName: q },
        { lotNumber: { contains: q } },
        { description: { contains: q } },
      ];
    }

    // FILTERS
    if (category) where.category = category;
    if (subject) where.subject = subject;
    if (status) where.status = status; // ✅ ADD THIS

    const lots = await prisma.lot.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(lots);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
