import { ManageInventoryHandler } from "@/app/api/handler/inventory-handler";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/inventories/stock/[id]">
) {
  const { id } = await ctx.params;

  return ManageInventoryHandler(req, id);
}
