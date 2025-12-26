import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";


export async function GET() {
  try {
    // Prisma exposes enums via $queryRaw or schema knowledge
    // For SQLite + Prisma, safest method is static enum mapping

    const artists = [
      "RODIN",
      "PICASSO",
      "MICHELANGELO",
      "VAN_GOGH",
    ];

    return NextResponse.json(artists);
  } catch (error) {
    console.error("Artist API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
