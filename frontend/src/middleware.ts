import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  // if user is logged in, redirect to home page
  if (accessToken) {
    if (requestPath === "/login" || requestPath === "/register")
      return NextResponse.redirect(new URL("/", request.url));
    return;
  }
  // if not logged in and trying to login or register, allow request
  if (requestPath === "/login" || requestPath === "/register") return;

  // if not logged in and trying to access any other page, redirect to login page
  return NextResponse.redirect(new URL("/login", request.url));
}
