import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { requireManager } from "../../../lib/auth/requieManager";

export async function POST(request: Request) {
  const isManager = await requireManager();
  if (!isManager) {
    return NextResponse.json(
      { error: "Manager access only" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { staffId, password, name } = body;

  if (!staffId || !password) {
    return NextResponse.json(
      { error: "staffId and password are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { staffId },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Staff ID already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      staffId,
      name: name || "Staff User",
      role: "STAFF",
      passwordHash,
    },
  });

  return NextResponse.json(
    {
      message: "Staff account created",
      staffId: user.staffId,
    },
    { status: 201 }
  );
}
