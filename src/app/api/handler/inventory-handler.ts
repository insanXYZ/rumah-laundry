import {
  AddInventoryRequest,
  EditInventoryRequest,
  ListInventoriesResponse,
  ListInventoryStock,
  ManageInventoryRequest,
} from "@/app/dto/inventory-dto";
import db from "@/db";
import { inventoryStockTable, inventoryTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { desc, eq, like, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

// POST /inventories
export async function AddInventoryHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddInventoryRequest.parse(json);

    await db.transaction(async (tx) => {
      const res = await tx
        .insert(inventoryTable)
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

// GET /inventories
export async function ListInventoriesHandler(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const nameParam = searchParams.get("name");

    const name = nameParam ? `%${nameParam}%` : `%%`;

    const inventories = await db
      .select({
        id: inventoryTable.id,
        name: inventoryTable.name,
        stock: sql<number>`sum(${inventoryStockTable.stock})`,
      })
      .from(inventoryTable)
      .innerJoin(
        inventoryStockTable,
        eq(inventoryTable.id, inventoryStockTable.inventory_id)
      )
      .where(like(inventoryTable.name, name))
      .groupBy(inventoryTable.id);

    const listInventories: ListInventoriesResponse = inventories.map((i) => {
      return {
        id: i.id,
        name: i.name,
        stock: i.stock,
      };
    });

    return ResponseOk(listInventories, "sukses mendapatkan data persediaan");
  } catch (error) {
    return ResponseErr("gagal mendapatkan data persediaan", error);
  }
}

// PUT /inventories/[id]
export async function EditInventoryHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditInventoryRequest.parse(json);

    await db
      .update(inventoryTable)
      .set({
        name: body.name,
      })
      .where(eq(inventoryTable.id, Number(id)));

    return ResponseOk(null, "sukses mengubah persediaan");
  } catch (error) {
    return ResponseErr("gagal mengubah persediaan", error);
  }
}

export async function DeleteInventoryHandler(req: NextRequest, id: string) {
  try {
    await db.delete(inventoryTable).where(eq(inventoryTable.id, Number(id)));

    return ResponseOk(null, "sukses menghapus persediaan");
  } catch (error) {
    return ResponseErr("gagal menghapus persediaan", error);
  }
}

export async function ManageInventoryHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = ManageInventoryRequest.parse(json);

    await db.transaction(async (tx) => {
      const [sQty] = await tx
        .select({
          id: inventoryTable.id,
          sum_qty: sql<number>`sum(${inventoryStockTable.stock})`,
        })
        .from(inventoryTable)
        .where(eq(inventoryTable.id, Number(id)))
        .innerJoin(
          inventoryStockTable,
          eq(inventoryTable.id, inventoryStockTable.inventory_id)
        )
        .groupBy(inventoryTable.id);

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
        inventoryTable,
        eq(inventoryStockTable.inventory_id, inventoryTable.id)
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
