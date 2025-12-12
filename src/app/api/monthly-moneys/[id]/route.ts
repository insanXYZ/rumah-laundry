import { NextRequest } from "next/server";
import { DeleteMonthlyMoneyHandler } from "../../handler/monthly-money-handler";

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/monthly-moneys/[id]">
) {
  const { id } = await ctx.params;

  return DeleteMonthlyMoneyHandler(req, id);
}
