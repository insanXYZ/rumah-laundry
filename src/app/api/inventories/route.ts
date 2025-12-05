import { NextRequest } from "next/server";
import {
  CreateInventoryHandler,
  ListAllInventoryHandler,
} from "../handler/inventory-handler";

export async function POST(req: NextRequest) {
  return CreateInventoryHandler(req);
}

export async function GET(req: NextRequest) {
  return ListAllInventoryHandler(req);
}
