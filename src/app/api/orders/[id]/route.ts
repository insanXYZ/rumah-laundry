import { NextRequest } from "next/server";
import { UpdateOrderHandler } from "../../handler/order-handler";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]">
) {
  const { id } = await ctx.params;

  return UpdateOrderHandler(req, id);
}
