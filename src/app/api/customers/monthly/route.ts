import { NextRequest } from "next/server";
import { ListCustomersMonthlyHandler } from "../../handler/customer-handler";

export async function GET(req: NextRequest) {
  return ListCustomersMonthlyHandler(req);
}
