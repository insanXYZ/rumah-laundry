import {
  AddCustomerRequest,
  EditCustomerRequest,
  ListCustomersResponse,
} from "@/app/dto/customer-dto";
import { ListOrderCustomersResponse } from "@/app/dto/order-dto";
import db from "@/db";
import {
  chargeSantriTable,
  Customer,
  customerTable,
  santriMonthlyMoneyTable,
} from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { getPayloadJwt } from "@/utils/utils";
import { and, between, eq, inArray, isNull, like, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

// GET /customers
export async function ListCustomersHandler(req: NextRequest) {
  try {
    const payload = getPayloadJwt(req);

    const searchParams = req.nextUrl.searchParams;

    const nameParam = searchParams.get("name");
    let name = nameParam ? `%${nameParam}%` : "%%";

    const customers = await db
      .select()
      .from(customerTable)
      .where(and(like(customerTable.name, name)));

    const listCustomers: ListCustomersResponse = customers.map((c) => {
      return {
        class: c.class!,
        id: c.id,
        address: c.address!,
        type: c.type,
        created_at: DateTime.fromJSDate(c.created_at)
          .setZone(payload.tz)
          .toJSDate(),
        name: c.name,
        number_phone: c.number_phone,
      };
    });

    return ResponseOk(listCustomers, "sukses mendapat data pelanggan");
  } catch (error) {
    return ResponseErr("gagal mendapat data pelanggan", error);
  }
}

// POST /customers
export async function AddCustomerHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddCustomerRequest.parse(json);

    await db
      .insert(customerTable)
      .values({
        name: body.name,
        number_phone: body.number_phone,
        type: body.type,
        class: body.class,
        address: body.address,
      })
      .execute();

    return ResponseOk(null, "sukses menambah pelanggan");
  } catch (error) {
    return ResponseErr("gagal menambah pelanggan", error);
  }
}

// PUT /customer/[id]
export async function EditCustomerHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditCustomerRequest.parse(json);

    let values: Customer = {
      name: body.name,
      number_phone: body.number_phone,
      type: body.type,
    };

    if (body.type === "santri") {
      values.class = body.class;
    }

    if (body.type === "umum") {
      values.address = body.address;
    }

    await db
      .update(customerTable)
      .set(values)
      .where(eq(customerTable.id, Number(id)));

    return ResponseOk(null, "sukses mengubah pelanggan");
  } catch (error) {
    return ResponseErr("gagal mengubah pelanggan", error);
  }
}

// DELETE /customer/[id]
export async function DeleteCustomerHandler(req: NextRequest, id: string) {
  try {
    await db.delete(customerTable).where(eq(customerTable.id, Number(id)));

    return ResponseOk(null, "sukses menghapus pelanggan");
  } catch (error) {
    return ResponseErr("gagal menghapus pelanggan", error);
  }
}

// GET /orders/customer
export async function ListOrderCustomersHandler(req: NextRequest) {
  try {
    const payload = getPayloadJwt(req);
    const now = DateTime.now().setZone(payload.tz);

    const customers = await db
      .select({
        id: customerTable.id,
        name: customerTable.name,
        class: customerTable.class,
        type: customerTable.type,
        number_phone: customerTable.number_phone,
        address: customerTable.address,
        type_monthly_money: santriMonthlyMoneyTable.type,
      })
      .from(customerTable)
      .leftJoin(
        santriMonthlyMoneyTable,
        and(
          eq(customerTable.id, santriMonthlyMoneyTable.customer_id),
          sql`MONTH(${santriMonthlyMoneyTable.created_at}) = ${now.month}`,
          sql`YEAR(${santriMonthlyMoneyTable.created_at}) = ${now.year}`
        )
      );

    return ResponseOk(
      customers as ListOrderCustomersResponse,
      "sukses menampilkan pelanggan order"
    );
  } catch (error) {
    return ResponseErr("gagal menampilkan pelanggan order", error);
  }
}

// GET /customers/monthly
export async function ListCustomersMonthlyHandler(req: NextRequest) {
  try {
    const payload = getPayloadJwt(req);
    const now = DateTime.now().setZone(payload.tz);
    const startDate = now.startOf("month").toJSDate();
    const endDate = now.endOf("month").toJSDate();

    const customerIds = await db
      .select({
        id: customerTable.id,
      })
      .from(customerTable)
      .leftJoin(
        santriMonthlyMoneyTable,
        and(
          eq(customerTable.id, santriMonthlyMoneyTable.customer_id),
          between(santriMonthlyMoneyTable.created_at, startDate, endDate)
        )
      )
      .where(
        and(
          eq(customerTable.type, "santri"),
          isNull(santriMonthlyMoneyTable.id)
        )
      );

    const arrCustomerIds = customerIds.map((v) => v.id);

    const customers = await db
      .select({
        id: customerTable.id,
        name: customerTable.name,
        charge_qty: sql<number>`COALESCE(SUM(${chargeSantriTable.quantity}) , 0)`,
      })
      .from(customerTable)
      .leftJoin(
        chargeSantriTable,
        and(
          eq(customerTable.id, chargeSantriTable.customer_id),
          eq(chargeSantriTable.payed, false)
        )
      )
      .where(
        and(
          eq(customerTable.type, "santri"),
          inArray(customerTable.id, arrCustomerIds)
        )
      )
      .groupBy(customerTable.id);

    return ResponseOk(customers, "sukses mendapatkan pelanggan bulanan");
  } catch (error) {
    return ResponseErr("gagal mendapatkan pelanggan bulanan");
  }
}
