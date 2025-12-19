import { NextRequest } from "next/server";
import { ListChargesHandler } from "../../handler/monthly-money-handler";

export async function GET(req: NextRequest) {
  return ListChargesHandler(req);
}
