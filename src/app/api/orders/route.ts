import { NextRequest } from "next/server";
import {
  CreateOrderHandler,
  ListOrdersHandler,
} from "../handler/order-handler";

export async function POST(req: NextRequest) {
  return CreateOrderHandler(req);
}

export async function GET(req: NextRequest) {
  return ListOrdersHandler(req);
}
