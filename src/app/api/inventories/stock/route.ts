import { NextRequest } from "next/server";
import { ListInventoryStockHandler } from "../../handler/inventory-handler";

export async function GET(req: NextRequest) {
  return ListInventoryStockHandler(req);
}
