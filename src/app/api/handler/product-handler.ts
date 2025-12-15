import {
  AddProductSchema,
  EditProductSchema,
  Product,
} from "@/app/dto/product-dto";
import db from "@/db";
import { productsTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { eq, like } from "drizzle-orm";
import { NextRequest } from "next/server";

export const acceptedUnit: string[] = ["kg", "pcs"];

export async function CreateProductHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddProductSchema.parse(json);

    if (!acceptedUnit.includes(body.unit)) {
      return ResponseErr("unit tidak valid");
    }

    await db
      .insert(productsTable)
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

export async function ListAllProductsHandler(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const nameParam = searchParams.get("name");
    let name = nameParam ? `%${nameParam}%` : "%%";

    const products = await db
      .select()
      .from(productsTable)
      .where(like(productsTable.name, name));

    let listProducts: Product[] = [];

    products.forEach((v) => {
      const product: Product = {
        name: v.name,
        price: v.price,
        unit: v.unit,
        id: v.id,
      };

      listProducts.push(product);
    });

    return ResponseOk(listProducts, "sukses menampilkan products");
  } catch (error) {
    return ResponseErr("gagal menampilkan products", error);
  }
}

export async function EditProductHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditProductSchema.parse(json);

    if (!acceptedUnit.includes(body.unit)) {
      return ResponseErr("unit tidak valid");
    }

    await db
      .update(productsTable)
      .set({
        name: body.name,
        price: body.price,
        unit: body.unit,
      })
      .where(eq(productsTable.id, Number(id)));

    return ResponseOk(null, "sukses mengubah product");
  } catch (error) {
    return ResponseErr("gagal mengubah product", error);
  }
}

export async function DeleteProductHandler(req: NextRequest, id: string) {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, Number(id)));
    return ResponseOk(null, "sukses menghapus product");
  } catch (error) {
    return ResponseErr("gagal menghapus product", error);
  }
}
