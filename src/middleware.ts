import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow access to the login page and its API
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 2. Check for the session cookie
  const session = request.cookies.get("admin_session");

  // 3. If no cookie, redirect to login
  if (!session || session.value !== "authenticated") {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run this middleware on /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};