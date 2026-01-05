import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireManager } from "../../../../lib/auth/requieManager";

export async function POST(req: NextRequest) {
  const isManager = await requireManager();
  if (!isManager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { staffId } = await req.json();

  if (!staffId) {
    return NextResponse.json({ error: "Missing staffId" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { staffId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { staffId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete staff:", err);
    return NextResponse.json(
      { error: "Failed to delete staff" },
      { status: 500 }
    );
  }
}
