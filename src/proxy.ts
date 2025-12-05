import { VerifyJwt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("X-ACC-TOKEN")?.value;
  console.log("token", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await VerifyJwt(token);

    return NextResponse.next();
  } catch (err) {
    (await cookies()).delete("X-ACC-TOKEN");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/customer"],
};
