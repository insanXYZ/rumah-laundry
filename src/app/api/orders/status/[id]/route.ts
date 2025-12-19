import { NextRequest } from "next/server";
import { UpdateStatusOrderHandler } from "../../../handler/order-handler";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/orders/status/[id]">
) {
  const { id } = await ctx.params;

  return UpdateStatusOrderHandler(req, id);
}
