import { NextRequest } from "next/server";
import { ApiMiddleware } from "./middleware/api";
import { ClientMiddleware } from "./middleware/client";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) {
    return ApiMiddleware(req);
  } else {
    return ClientMiddleware(req);
  }
}

export const config = {
  matcher: [
    // Match semua API routes
    "/api/:path*",

    // Match semua client routes KECUALI static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
};
