import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES } from "@/constants/shared/routes";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Redirect to dashboard if token is present and pathname is root or login
  if (token && (pathname === '/' || pathname === ROUTES.LOGIN)) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  // Allow public paths
  if (pathname === ROUTES.LOGIN) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
