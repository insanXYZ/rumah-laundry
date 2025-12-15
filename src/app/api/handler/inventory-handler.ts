import {
  AddInventorySchema,
  EditInventorySchema,
  Inventory,
  ListInventoryStock,
  ManageInventorySchema,
} from "@/app/dto/inventory-dto";
import db from "@/db";
import { inventoriesTable, inventoryStockTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { desc, eq, like, sql } from "drizzle-orm";
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
        price: body.price,
        description: "inventaris baru",
      });
    });

    return ResponseOk(null, "sukses membuat persediaan");
  } catch (error) {
    return ResponseErr("gagal membuat persediaan", error);
  }
}

export async function ListAllInventoryHandler(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const nameParam = searchParams.get("name");

    const name = nameParam ? `%${nameParam}%` : `%%`;

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
      .where(like(inventoriesTable.name, name))
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

export async function ManageStockHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = ManageInventorySchema.parse(json);

    await db.transaction(async (tx) => {
      const [sQty] = await tx
        .select({
          id: inventoriesTable.id,
          sum_qty: sql<number>`sum(${inventoryStockTable.stock})`,
        })
        .from(inventoriesTable)
        .where(eq(inventoriesTable.id, Number(id)))
        .innerJoin(
          inventoryStockTable,
          eq(inventoriesTable.id, inventoryStockTable.inventory_id)
        )
        .groupBy(inventoriesTable.id);

      if (body.stock < 0) {
        if (sQty.sum_qty + body.stock < 0) {
          throw new Error("stok melebihi batas minimal");
        }
      }

      await tx.insert(inventoryStockTable).values({
        inventory_id: sQty.id,
        stock: body.stock,
        description: body.description,
        price: body.price,
      });
    });

    return ResponseOk(null, "sukses mengubah stok inventaris");
  } catch (error) {
    return ResponseErr("gagal mengubah stok inventaris", error);
  }
}

export async function ListInventoryStockHandler(req: NextRequest) {
  try {
    const stockInventories = await db
      .select()
      .from(inventoryStockTable)
      .innerJoin(
        inventoriesTable,
        eq(inventoryStockTable.inventory_id, inventoriesTable.id)
      )
      .orderBy(desc(inventoryStockTable.created_at));

    const resInventories: ListInventoryStock[] = stockInventories.map((s) => {
      return {
        created_at: s.inventory_stock.created_at!,
        description: s.inventory_stock.description!,
        name: s.inventories.name,
        price: s.inventory_stock.price!,
        stock: s.inventory_stock.stock,
      };
    });

    return ResponseOk(resInventories, "sukses menampilkan riwayat inventaris");
  } catch (error) {
    return ResponseErr("gagal menampilkan riwayat inventaris", error);
  }
}
