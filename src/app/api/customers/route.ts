import { NextRequest } from "next/server";
import {
  CreateCustomerHandler,
  ListAllCustomerHandler,
} from "../handler/customer-handler";

export async function GET(req: NextRequest) {
  return ListAllCustomerHandler(req);
}

export async function POST(req: NextRequest) {
  return CreateCustomerHandler(req);
}
