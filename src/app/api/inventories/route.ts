import { NextRequest } from "next/server";
import {
  AddInventoryHandler,
  ListInventoriesHandler,
} from "../handler/inventory-handler";

export async function POST(req: NextRequest) {
  return AddInventoryHandler(req);
}

export async function GET(req: NextRequest) {
  return ListInventoriesHandler(req);
}
