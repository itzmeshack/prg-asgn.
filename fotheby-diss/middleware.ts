import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔒 Manager-only page
  if (pathname.startsWith("/dashboard/staff")) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    const role = (token as any)?.role;

    if (!token || role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
