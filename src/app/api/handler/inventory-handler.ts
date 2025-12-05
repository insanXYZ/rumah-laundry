import {
  AddInventorySchema,
  EditInventorySchema,
  Inventory,
} from "@/app/dto/inventory-dto";
import db from "@/db";
import { inventoriesTable, inventoryStockTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function CreateInventoryHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddInventorySchema.parse(json);

    await db.transaction(async (tx) => {
      const res = await tx
        .insert(inventoriesTable)
        .values({
          name: body.name,
        })
        .execute();

      await tx.insert(inventoryStockTable).values({
        inventory_id: res[0].insertId,
        stock: body.stock,
        description: "menambah stok",
      });
    });

    return ResponseOk(null, "sukses membuat persediaan");
  } catch (error) {
    return ResponseErr("gagal membuat persediaan", error);
  }
}

export async function ListAllInventoryHandler(req: NextRequest) {
  try {
    const inventories = await db
      .select({
        id: inventoriesTable.id,
        name: inventoriesTable.name,
        stock: sql<number>`sum(${inventoryStockTable.stock})`,
      })
      .from(inventoriesTable)
      .innerJoin(
        inventoryStockTable,
        eq(inventoriesTable.id, inventoryStockTable.inventory_id)
      )
      .groupBy(inventoriesTable.id);

    let listInventories: Inventory[] = [];

    inventories.forEach((v) => {
      const inventory: Inventory = {
        name: v.name,
        stock: v.stock,
        id: v.id,
      };

      listInventories.push(inventory);
    });

    return ResponseOk(listInventories, "sukses menampilkan persediaan");
  } catch (error) {
    return ResponseErr("gagal menampilkan persediaan", error);
  }
}

export async function EditInventoryHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditInventorySchema.parse(json);

    await db
      .update(inventoriesTable)
      .set({
        name: body.name,
      })
      .where(eq(inventoriesTable.id, Number(id)));

    return ResponseOk(null, "sukses mengubah persediaan");
  } catch (error) {
    return ResponseErr("gagal mengubah persediaan", error);
  }
}

export async function DeleteInventoryHandler(req: NextRequest, id: string) {
  try {
    await db
      .delete(inventoriesTable)
      .where(eq(inventoriesTable.id, Number(id)));

    return ResponseOk(null, "sukses menghapus persediaan");
  } catch (error) {
    return ResponseErr("gagal menghapus persediaan", error);
  }
}
