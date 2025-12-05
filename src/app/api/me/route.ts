import { NextRequest } from "next/server";
import { MeHandler } from "../handler/auth-handler";

export async function GET(req: NextRequest) {
  return MeHandler(req);
}
