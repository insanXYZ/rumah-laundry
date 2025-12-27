import {
  AddSantriMonthlyMoneyRequest,
  ListChargesResponse,
} from "@/app/dto/monthly-money-dto";
import db from "@/db";
import {
  chargeSantriTable,
  customerTable,
  santriMonthlyMoneyTable,
} from "@/db/schema";
import {
  ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI,
  PRICE_TYPE_MONTHLY_MONEY_MAP,
} from "@/types/types";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { dateToTimezone, getPayloadJwt, timeNowUTC } from "@/utils/utils";
import { and, desc, eq, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

// POST /monthly-moneys
export async function AddSantriMonthlyMoneyHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddSantriMonthlyMoneyRequest.parse(json);

    if (!ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI.includes(body.type)) {
      throw new Error("tipe bulanan tidak diketahui");
    }

    await db.transaction(async (tx) => {
      const customers = await tx
        .select()
        .from(customerTable)
        .where(
          and(
            eq(customerTable.id, Number(body.customer_id)),
            eq(customerTable.type, "santri")
          )
        );

      if (customers.length == 0) {
        throw new Error("santri tidak diketahui");
      }

      const totalPriceCharges = await tx
        .select({
          total_price: sql<number>`sum(${chargeSantriTable.total_price})`,
        })
        .from(chargeSantriTable)
        .where(
          and(
            eq(chargeSantriTable.customer_id, Number(body.customer_id)),
            eq(chargeSantriTable.payed, false)
          )
        )
        .groupBy(chargeSantriTable.customer_id);

      const priceCharge =
        totalPriceCharges.length != 0
          ? Number(totalPriceCharges[0].total_price)
          : 0;

      await tx
        .insert(santriMonthlyMoneyTable)
        .values({
          type: body.type,
          created_at: timeNowUTC(),
          amount:
            Number(PRICE_TYPE_MONTHLY_MONEY_MAP.get(body.type) ?? 0) +
            priceCharge,
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
export async function ListMonthlyMoneysHandler() {
  try {
    const santriMonthlyMoneys = await db
      .select({
        id: santriMonthlyMoneyTable.id,
        customer_id: santriMonthlyMoneyTable.customer_id,
        name: customerTable.name,
        amount: santriMonthlyMoneyTable.amount,
        type: santriMonthlyMoneyTable.type,
        created_at: santriMonthlyMoneyTable.created_at,
      })
      .from(santriMonthlyMoneyTable)
      .innerJoin(
        customerTable,
        eq(santriMonthlyMoneyTable.customer_id, customerTable.id)
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

// GET /monthly-moneys/charge
export async function ListChargesHandler(req: NextRequest) {
  try {
    const payload = getPayloadJwt(req);

    const charges = await db
      .select()
      .from(chargeSantriTable)
      .leftJoin(
        customerTable,
        eq(chargeSantriTable.customer_id, customerTable.id)
      )
      .orderBy(desc(chargeSantriTable.id));

    const res: ListChargesResponse = charges.map((c) => {
      return {
        id: c.charge_santries.id,
        period: DateTime.fromJSDate(
          dateToTimezone(c.charge_santries.created_at!, payload.tz)
        ).toFormat("yyyy-MM"),
        name: c.customers?.name!,
        quantity: Number(c.charge_santries.quantity),
        total_price: c.charge_santries.total_price!,
        payed: c.charge_santries.payed!,
      };
    });

    return ResponseOk(res, "sukses mendapatkan data charge");
  } catch (error: any) {
    return ResponseErr("gagal mendapatkan data charge", error);
  }
}
