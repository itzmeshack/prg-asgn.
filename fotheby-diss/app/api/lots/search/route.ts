import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const subject = searchParams.get("subject")?.trim();

    const where: any = {
      archived: false,
    };

    // --------------------
    // SEARCH LOGIC (SCHEMA-SAFE)
    // --------------------
    if (q) {
      where.OR = [
        // 1️⃣ Artist (ENUM → exact match)
        { artistName: q },

        // 2️⃣ Lot number (STRING → partial or exact)
        {
          lotNumber: {
            contains: q,
          },
        },

        // 3️⃣ Description (STRING → partial)
        {
          description: {
            contains: q,
          },
        },
      ];
    }

    // --------------------
    // FILTERS
    // --------------------
    if (category) {
      where.category = category;
    }

    if (subject) {
      where.subject = subject;
    }

    console.log("SEARCH PARAMS:", { q, category, subject });

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
