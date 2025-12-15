import {
  acceptedTypeMonthlyMoney,
  AddSantriMonthlyMoneySchema,
  priceTypeMonthlyMoney,
} from "@/app/dto/monthly-money-dto";
import db from "@/db";
import {
  chargeSantriTable,
  customersTable,
  santriMonthlyMoneyTable,
} from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

// POST /monthly-moneys
export async function CreateMonthlyMoneyHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddSantriMonthlyMoneySchema.parse(json);

    if (!acceptedTypeMonthlyMoney.includes(body.type)) {
      throw new Error("tipe bulanan tidak diketahui");
    }

    await db.transaction(async (tx) => {
      const customers = await tx
        .select()
        .from(customersTable)
        .where(
          and(
            eq(customersTable.id, Number(body.customer_id)),
            eq(customersTable.type, "santri")
          )
        );

      if (customers.length == 0) {
        throw new Error("santri tidak diketahui");
      }

      await tx
        .insert(santriMonthlyMoneyTable)
        .values({
          type: body.type,
          amount: priceTypeMonthlyMoney.get(body.type) ?? 0,
          customer_id: Number(body.customer_id),
        })
        .execute();

      await tx
        .update(chargeSantriTable)
        .set({
          payed: true,
        })
        .where(eq(chargeSantriTable.customer_id, Number(body.customer_id)));
    });

    return ResponseOk(null, "sukses membuat bulanan santri");
  } catch (error) {
    return ResponseErr("gagal membuat bulanan santri", error);
  }
}

// GET /monthly-moneys
export async function ListAllMonthlyMoneyHandler() {
  try {
    const santriMonthlyMoneys = await db
      .select({
        id: santriMonthlyMoneyTable.id,
        customer_id: santriMonthlyMoneyTable.customer_id,
        name: customersTable.name,
        type: santriMonthlyMoneyTable.type,
        created_at: santriMonthlyMoneyTable.created_at,
      })
      .from(santriMonthlyMoneyTable)
      .innerJoin(
        customersTable,
        eq(santriMonthlyMoneyTable.customer_id, customersTable.id)
      )
      .orderBy(desc(santriMonthlyMoneyTable.created_at));

    return ResponseOk(santriMonthlyMoneys, "sukses menampilkan bulanan santri");
  } catch (error) {
    return ResponseErr("gagal menampilkan bulanan santri", error);
  }
}

// DELETE /monthly-moneys/[id]
export async function DeleteMonthlyMoneyHandler(req: NextRequest, id: string) {
  try {
    await db
      .delete(santriMonthlyMoneyTable)
      .where(eq(santriMonthlyMoneyTable.id, Number(id)));

    return ResponseOk(null, "sukses menghapus bulanan santri");
  } catch (error) {
    return ResponseErr("gagal menghapus bulanan santri", error);
  }
}
