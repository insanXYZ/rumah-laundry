import { VerifyJwt } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function ApiMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("X-ACC-TOKEN")?.value;

  if (pathname !== "/api/login" && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (token) {
    const verified = await VerifyJwt(token);

    if (!verified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}
