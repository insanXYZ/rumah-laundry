import {
  AddCustomerSchema,
  Customer,
  EditCustomerSchema,
} from "@/app/dto/customer-dto";
import db from "@/db";
import {
  chargeSantriTable,
  customersTable,
  santriMonthlyMoneyTable,
} from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { GetPayload } from "@/utils/utils";
import { and, between, eq, inArray, isNull, like, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

// GET /customer
export async function ListAllCustomerHandler(req: NextRequest) {
  try {
    let typeCustomers = "%%";
    let name = "%%";

    const searchParams = req.nextUrl.searchParams;

    const typeParam = searchParams.get("type");
    if (typeParam) {
      typeCustomers = `%${typeParam}%`;
    }

    const nameParam = searchParams.get("name");
    if (nameParam) {
      name = `%${nameParam}%`;
    }

    const customers = await db
      .select()
      .from(customersTable)
      .where(
        and(
          like(customersTable.type, typeCustomers),
          like(customersTable.name, name)
        )
      );

    let listCustomers: Customer[] = [];

    customers.forEach((v) => {
      const data: Customer = {
        class: v.class!,
        id: v.id,
        address: v.address!,
        type: v.type! as "santri" | "umum",
        name: v.name,
        number_phone: v.number_phone,
      };

      listCustomers.push(data);
    });

    return ResponseOk(listCustomers, "sukses mendapat data pelanggan");
  } catch (error) {
    return ResponseErr("gagal mendapat data pelanggan", error);
  }
}

// POST /customer
export async function CreateCustomerHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddCustomerSchema.parse(json);

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

    await db.insert(customersTable).values(values).execute();

    return ResponseOk(null, "sukses menambah pelanggan");
  } catch (error) {
    return ResponseErr("gagal menambah pelanggan", error);
  }
}

// PUT /customer/[id]
export async function EditCustomerHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditCustomerSchema.parse(json);

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
      .update(customersTable)
      .set(values)
      .where(eq(customersTable.id, Number(id)));

    return ResponseOk(null, "sukses mengubah pelanggan");
  } catch (error) {
    return ResponseErr("gagal mengubah pelanggan", error);
  }
}

// DELETE /customer/[id]
export async function DeleteCustomerHandler(req: NextRequest, id: string) {
  try {
    await db.delete(customersTable).where(eq(customersTable.id, Number(id)));

    return ResponseOk(null, "sukses menghapus pelanggan");
  } catch (error) {
    return ResponseErr("gagal menghapus pelanggan", error);
  }
}

export async function ListAllOrderCustomerHandler() {
  try {
    const customers = await db
      .select({
        id: customersTable.id,
        name: customersTable.name,
        class: customersTable.class,
        type: customersTable.type,
        number_phone: customersTable.number_phone,
        address: customersTable.address,
        type_monthly_money: santriMonthlyMoneyTable.type,
      })
      .from(customersTable)
      .leftJoin(
        santriMonthlyMoneyTable,
        and(
          eq(customersTable.id, santriMonthlyMoneyTable.customer_id),
          sql`MONTH(${santriMonthlyMoneyTable.created_at}) = MONTH(NOW())`,
          sql`YEAR(${santriMonthlyMoneyTable.created_at}) = YEAR(NOW())`
        )
      );

    return ResponseOk(customers, "sukses menampilkan pelanggan order");
  } catch (error) {
    return ResponseErr("gagal menampilkan pelanggan order", error);
  }
}

export async function ListCustomerMonthlyHandler(req: NextRequest) {
  try {
    const payload = GetPayload(req);
    const now = DateTime.now().setZone(payload.tz);
    const startDate = now.startOf("month").toJSDate();
    const endDate = now.endOf("month").toJSDate();

    const customerIds = await db
      .select({
        id: customersTable.id,
      })
      .from(customersTable)
      .leftJoin(
        santriMonthlyMoneyTable,
        and(
          eq(customersTable.id, santriMonthlyMoneyTable.customer_id),
          between(santriMonthlyMoneyTable.created_at, startDate, endDate)
        )
      )
      .where(
        and(
          eq(customersTable.type, "santri"),
          isNull(santriMonthlyMoneyTable.id)
        )
      );

    const arrCustomerIds = customerIds.map((v) => v.id);

    const customers = await db
      .select({
        id: customersTable.id,
        name: customersTable.name,
        charge_qty: sql<number>`COALESCE(SUM(${chargeSantriTable.quantity}) , 0)`,
      })
      .from(customersTable)
      .leftJoin(
        chargeSantriTable,
        and(
          eq(customersTable.id, chargeSantriTable.customer_id),
          eq(chargeSantriTable.payed, false)
        )
      )
      .where(
        and(
          eq(customersTable.type, "santri"),
          inArray(customersTable.id, arrCustomerIds)
        )
      )
      .groupBy(customersTable.id);

    return ResponseOk(customers, "sukses mendapatkan pelanggan bulanan");
  } catch (error) {
    return ResponseErr("gagal mendapatkan pelanggan bulanan");
  }
}
