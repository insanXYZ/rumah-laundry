import {
  AddCustomerSchema,
  Customer,
  EditCustomerSchema,
} from "@/app/dto/customer-dto";
import db from "@/db";
import { customersTable, santriMonthlyMoneyTable } from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { and, eq, like, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

// GET /customer
export async function ListAllCustomerHandler(req: NextRequest) {
  try {
    let typeCustomers = "%%";

    const { searchParams } = new URL(req.url);

    const typeParam = searchParams.get("type");
    if (typeParam) {
      typeCustomers = `%${typeParam}%`;
    }

    const customers = await db
      .select()
      .from(customersTable)
      .where(like(customersTable.type, typeCustomers));

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
