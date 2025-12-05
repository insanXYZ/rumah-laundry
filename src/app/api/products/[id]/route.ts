import { NextRequest } from "next/server";
import {
  DeleteProductHandler,
  EditProductHandler,
} from "../../handler/product-handler";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/products/[id]">
) {
  const { id } = await ctx.params;

  return EditProductHandler(req, id);
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/products/[id]">
) {
  const { id } = await ctx.params;

  return DeleteProductHandler(req, id);
}
