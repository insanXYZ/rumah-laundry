import { NextRequest } from "next/server";
import { ListCustomerMonthlyHandler } from "../../handler/customer-handler";

export async function GET(req: NextRequest) {
  return ListCustomerMonthlyHandler(req);
}
