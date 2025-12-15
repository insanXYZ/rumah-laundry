import { VerifyJwt } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function ApiMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("X-ACC-TOKEN")?.value;

  if (pathname !== "/api/admins/login" && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!token) {
    return NextResponse.next();
  }

  const payload = await VerifyJwt(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-payload", JSON.stringify(payload));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
