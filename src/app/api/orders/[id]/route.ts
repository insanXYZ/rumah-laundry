import { NextRequest } from "next/server";
import { DeleteOrderHandler } from "../../handler/order-handler";

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]">
) {
  const { id } = await ctx.params;

  return DeleteOrderHandler(req, id);
}
