import { NextRequest } from "next/server";
import { EditAdminHandler } from "../../handler/auth-handler";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/customers/[id]">
) {
  const { id } = await ctx.params;

  return EditAdminHandler(req, id);
}
