import {
  AddProductRequest,
  EditProductRequest,
  ListProductsResponse,
} from "@/app/dto/product-dto";
import db from "@/db";
import { productTable } from "@/db/schema";
import { ACCEPTED_STATUS_ORDER, ACCEPTED_UNIT } from "@/types/types";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { dateToTimezone, getPayloadJwt } from "@/utils/utils";
import { eq, like } from "drizzle-orm";
import { NextRequest } from "next/server";

// POST /products
export async function AddProductHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddProductRequest.parse(json);

    if (!ACCEPTED_STATUS_ORDER.includes(body.unit)) {
      throw new Error("unit tidak valid");
    }

    await db
      .insert(productTable)
      .values({
        name: body.name,
        price: body.price,
        unit: body.unit,
      })
      .execute();

    return ResponseOk(null, "sukses membuat products");
  } catch (error) {
    return ResponseErr("gagal membuat products", error);
  }
}

// GET /products
export async function ListProductsHandler(req: NextRequest) {
  try {
    const payload = getPayloadJwt(req);
    const searchParams = req.nextUrl.searchParams;

    const nameParam = searchParams.get("name");
    let name = nameParam ? `%${nameParam}%` : "%%";

    const products = await db
      .select()
      .from(productTable)
      .where(like(productTable.name, name));

    const listProducts: ListProductsResponse = products.map((p) => {
      return {
        id: p.id,
        name: p.name,
        created_at: dateToTimezone(p.created_at!, payload.tz),
        price: p.price,
        unit: p.unit,
      };
    });

    return ResponseOk(listProducts, "sukses mendapatkan data products");
  } catch (error) {
    return ResponseErr("gagal mendapatkan data products", error);
  }
}

export async function EditProductHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditProductRequest.parse(json);

    if (!ACCEPTED_UNIT.includes(body.unit)) {
      return ResponseErr("unit tidak valid");
    }

    await db
      .update(productTable)
      .set({
        name: body.name,
        price: body.price,
        unit: body.unit,
      })
      .where(eq(productTable.id, Number(id)));

    return ResponseOk(null, "sukses mengubah product");
  } catch (error) {
    return ResponseErr("gagal mengubah product", error);
  }
}

export async function DeleteProductHandler(req: NextRequest, id: string) {
  try {
    await db.delete(productTable).where(eq(productTable.id, Number(id)));
    return ResponseOk(null, "sukses menghapus product");
  } catch (error) {
    return ResponseErr("gagal menghapus product", error);
  }
}
