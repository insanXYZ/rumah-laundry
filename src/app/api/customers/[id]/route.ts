import { NextRequest } from "next/server";
import {
  DeleteCustomerHandler,
  EditCustomerHandler,
} from "../../handler/customer-handler";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/customers/[id]">
) {
  const { id } = await ctx.params;

  return EditCustomerHandler(req, id);
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/customers/[id]">
) {
  const { id } = await ctx.params;

  return DeleteCustomerHandler(req, id);
}
