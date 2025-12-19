import { NextRequest } from "next/server";
import { ListOrderCustomersHandler } from "../../handler/customer-handler";

export async function GET(req: NextRequest) {
  return ListOrderCustomersHandler(req);
}
