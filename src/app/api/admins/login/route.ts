import { NextRequest } from "next/server";
import { LoginHandler } from "../../handler/auth-handler";

export async function POST(request: NextRequest) {
  return LoginHandler(request);
}
