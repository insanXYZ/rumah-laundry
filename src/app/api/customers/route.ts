import { NextRequest } from "next/server";
import {
  AddCustomerHandler,
  ListCustomersHandler,
} from "../handler/customer-handler";

export async function GET(req: NextRequest) {
  return ListCustomersHandler(req);
}

export async function POST(req: NextRequest) {
  return AddCustomerHandler(req);
}
