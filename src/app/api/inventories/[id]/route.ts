import { NextRequest } from "next/server";
import {
  DeleteInventoryHandler,
  EditInventoryHandler,
} from "../../handler/inventory-handler";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/inventories/[id]">
) {
  const { id } = await ctx.params;

  return EditInventoryHandler(req, id);
}

// export async function DELETE(
//   req: NextRequest,
//   ctx: RouteContext<"/api/customers/[id]">
// ) {
//   const { id } = await ctx.params;

//   return DeleteInventoryHandler(req, id);
// }
