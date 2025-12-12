import { VerifyJwt } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

const WhiteListPath = ["/login"];

export async function ClientMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("X-ACC-TOKEN")?.value;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath) {
    if (token) {
      const isValid = await VerifyJwt(token);
      if (isValid) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verifikasi token
  const isValid = await VerifyJwt(token);

  if (!isValid) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("X-ACC-TOKEN");
    return response;
  }

  // Token valid, lanjutkan req
  return NextResponse.next();
}
