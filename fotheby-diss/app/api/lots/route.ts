import { prisma } from "../../../lib/prisma";

import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/requireStaff";

export async function POST(req: Request) {
  const ok = await requireStaff();
  if (!ok) {
    return NextResponse.json(
      { error: "Staff access only" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const lot = await prisma.lot.create({
    data: {
      lotNumber: body.lotNumber,
      artistName: body.artistName,
      yearProduced: body.yearProduced,
      subject: body.subject,
      description: body.description,
      estimatedPrice: body.estimatedPrice,
      category: body.category,
      status: "DRAFT",
    },
  });

  return NextResponse.json(lot, { status: 201 });
}

