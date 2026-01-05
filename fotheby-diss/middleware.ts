import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const role = (token as any)?.role;
  const isStaff = role === "STAFF" || role === "MANAGER";
  const isManager = role === "MANAGER";

  /* ============================
     MANAGER-ONLY ROUTE
     ============================ */
  if (pathname.startsWith("/dashboard/staff")) {
    if (!token || !isManager) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  /* ============================
     STAFF-ONLY ROUTES
     ============================ */
 const staffOnlyPaths = [
  "/lots",              // list page
  "/lots/add",          // add page
  "/lots/edit",         // safety (not direct)
  "/lots/images",       // safety (not direct)
  "/search",
  "/auctions",
  "/dashboard/archived",
];


const isLotDetailPage =
  pathname.startsWith("/lots/") &&
  pathname.split("/").length === 3; // /lots/[lotNumber]

if (
  staffOnlyPaths.some(
    (path) =>
      pathname === path || pathname.startsWith(`${path}/`)
  ) &&
  !isLotDetailPage
) {
  if (!token || !isStaff) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/lots/:path*",
    "/search",
    "/auctions/:path*",
  ],
};
