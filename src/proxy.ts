import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  const isAuthEntry = path === "/login" || path === "/signup";
  const isPublicPath =
    path === "/" ||
    isAuthEntry ||
    path === "/forgotPassword" ||
    path === "/resetPassword" ||
    path === "/verifyemail";

  if (isAuthEntry && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotPassword",
    "/resetPassword",
  ],
};
