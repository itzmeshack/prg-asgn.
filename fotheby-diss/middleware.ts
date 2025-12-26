import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    const role = (token as any)?.role;

    if (!token || role !== "STAFF") {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
