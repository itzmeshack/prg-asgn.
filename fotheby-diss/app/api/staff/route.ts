import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { requireManager } from "../../../lib/auth/requieManager";

export async function GET(req: Request) {
  const isManager = await requireManager();
  if (!isManager) {
    return NextResponse.json({ items: [], totalPages: 1 }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").toLowerCase();
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 10;

  // Fetch all and filter manually (SQLite limitation)
  const allStaff = await prisma.user.findMany({
    where: { role: { in: ["STAFF", "MANAGER"] } },
    orderBy: { staffId: "asc" },
  });

  // Case-insensitive manual filtering
  const filtered = allStaff.filter((s) => {
    return (
      s.staffId.toLowerCase().includes(search) ||
      s.name.toLowerCase().includes(search)
    );
  });

  // Pagination
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    items: paginated,
    totalPages: Math.ceil(filtered.length / pageSize),
  });
}


// ===============================
// POST — CREATE STAFF ACCOUNT
// ===============================
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
