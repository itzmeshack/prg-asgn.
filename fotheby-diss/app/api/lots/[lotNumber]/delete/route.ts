import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ lotNumber: string }> }
) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "STAFF" && role !== "MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // MUST UNWRAP PARAMS — this fixes your error
  const { lotNumber } = await context.params;

  if (!lotNumber) {
    return NextResponse.json({ error: "Invalid lot number" }, { status: 400 });
  }

  try {
    await prisma.lot.delete({
      where: { lotNumber },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PRISMA DELETE ERROR:", err);
    return NextResponse.json({ error: "Failed to delete lot" }, { status: 500 });
  }
}
