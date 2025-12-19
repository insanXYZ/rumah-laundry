import {
  AddOrderRequest,
  ListOrder,
  ListOrdersResponse,
} from "@/app/dto/order-dto";
import db from "@/db";
import {
  chargeSantriTable,
  customerTable,
  orderItemTable,
  orderTable,
  productTable,
  santriMonthlyMoneyTable,
} from "@/db/schema";
import {
  ACCEPTED_STATUS_ORDER,
  ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI,
  ACCEPTED_UNIT,
  SANTRI_CHARGE_PRICE,
  SANTRI_LIMIT_KG_ORDER,
} from "@/types/types";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { dateToTimezone, getPayloadJwt } from "@/utils/utils";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";

export async function CreateOrderHandler(req: NextRequest) {
  try {
    const payload = getPayloadJwt(req);
    const now = DateTime.now().setZone(payload.tz);
    const json = await req.json();
    const body = AddOrderRequest.parse(json);

    await db.transaction(async (tx) => {
      const [customer] = await tx
        .select({
          id: customerTable.id,
          type_monthly_money: santriMonthlyMoneyTable.type,
        })
        .from(customerTable)
        .where(eq(customerTable.id, Number(body.customer_id)))
        .leftJoin(
          santriMonthlyMoneyTable,
          and(
            eq(santriMonthlyMoneyTable.customer_id, customerTable.id),
            sql`MONTH(${santriMonthlyMoneyTable.created_at}) = ${now.month}`,
            sql`YEAR(${santriMonthlyMoneyTable.created_at}) = ${now.year}`
          )
        )
        .limit(1);

      if (!customer) {
        throw new Error("pelanggan tidak diketahui");
      }

      const isSantriMonthly: boolean =
        ACCEPTED_TYPE_MONTHLY_MONEY_SANTRI.includes(
          customer.type_monthly_money!
        );

      let sumQty: number = 0;

      const productIds = body.items.map((item) => Number(item.product_id));

      const products = await tx
        .select()
        .from(productTable)
        .where(inArray(productTable.id, productIds));

      if (products.length !== productIds.length) {
        throw new Error("ada produk yang tidak valid");
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      const order = await tx
        .insert(orderTable)
        .values({
          customer_id: Number(body.customer_id),
          status: ACCEPTED_STATUS_ORDER[0],
        })
        .execute();

      const orderId = order[0].insertId;

      const orderItems = body.items.map((item) => {
        const product = productMap.get(Number(item.product_id))!;
        const itemOrder = {
          order_id: orderId,
          price: product.price,
          product_id: Number(item.product_id),
          quantity: item.quantity.toString(),
          total_price: product.price * item.quantity,
        };

        if (product.unit == ACCEPTED_UNIT[0]) {
          sumQty += item.quantity;
        }

        if (isSantriMonthly) {
          itemOrder.total_price = 0;
        }

        return itemOrder;
      });

      await tx.insert(orderItemTable).values(orderItems).execute();

      if (isSantriMonthly) {
        const qtyOrderItem = await db
          .select({
            qty_total: sql<number>`COALESCE(SUM(${orderItemTable.quantity}), 0)`,
          })
          .from(orderItemTable)
          .innerJoin(orderTable, eq(orderTable.id, orderItemTable.order_id))
          .innerJoin(
            productTable,
            eq(orderItemTable.product_id, productTable.id)
          )
          .where(
            and(
              eq(orderTable.customer_id, customer.id),
              eq(productTable.unit, ACCEPTED_UNIT[0]),
              sql<boolean>`MONTH(${orderItemTable.created_at}) = ${now.month}`,
              sql<boolean>`YEAR(${orderItemTable.created_at}) = ${now.year}`
            )
          )
          .groupBy(orderTable.customer_id);

        if (qtyOrderItem.length != 0) {
          sumQty += Number(qtyOrderItem[0].qty_total);
        }
        let chargeQty: number = 0;

        if (sumQty > SANTRI_LIMIT_KG_ORDER) {
          chargeQty = sumQty - SANTRI_LIMIT_KG_ORDER;
        }

        if (chargeQty != 0) {
          await db
            .delete(chargeSantriTable)
            .where(
              and(
                eq(chargeSantriTable.customer_id, customer.id),
                sql`MONTH(${chargeSantriTable.created_at}) = ${now.month}`,
                sql`YEAR(${chargeSantriTable.created_at}) = ${now.year}`
              )
            );

          await db.insert(chargeSantriTable).values({
            quantity: chargeQty.toString(),
            payed: false,
            total_price: chargeQty * SANTRI_CHARGE_PRICE,
            customer_id: customer.id,
          });
        }
      }
    });

    return ResponseOk(null, "sukses membuat order");
  } catch (error) {
    return ResponseErr("gagal membuat order", error);
  }
}

export async function ListOrdersHandler(req: NextRequest) {
  try {
    const payload = getPayloadJwt(req);

    const orders = await db
      .select({
        orderId: orderTable.id,
        orderCustomerId: orderTable.customer_id,
        orderStatus: orderTable.status,
        customerName: customerTable.name,
        itemId: orderItemTable.id,
        itemOrderId: orderItemTable.order_id,
        itemProductId: orderItemTable.product_id,
        itemQuantity: orderItemTable.quantity,
        itemPrice: orderItemTable.price,
        itemTotalPrice: orderItemTable.total_price,
        productName: productTable.name,
        created_at: orderTable.created_at,
      })
      .from(orderTable)
      .innerJoin(orderItemTable, eq(orderTable.id, orderItemTable.order_id))
      .innerJoin(customerTable, eq(orderTable.customer_id, customerTable.id))
      .innerJoin(productTable, eq(orderItemTable.product_id, productTable.id))
      .orderBy(desc(orderTable.created_at));

    const ordersMap = new Map<number, ListOrder>();

    orders.forEach((row) => {
      if (!ordersMap.has(row.orderId)) {
        ordersMap.set(row.orderId, {
          id: row.orderId,
          customer_id: row.orderCustomerId,
          name: row.customerName,
          created_at: row.created_at!,
          status: row.orderStatus!,
          order_items: [],
        });
      }

      const order = ordersMap.get(row.orderId)!;
      order.order_items.push({
        id: row.itemId!,
        order_id: row.itemOrderId,
        product_id: row.itemProductId,
        product_name: row.productName,
        quantity: Number(row.itemQuantity),
        created_at: dateToTimezone(row.created_at!, payload.tz),
        price: row.itemPrice!,
        total_price: row.itemTotalPrice!,
      });
    });

    const result: ListOrdersResponse = Array.from(ordersMap.values());

    return ResponseOk(result, "sukses mendapatkan data orders");
  } catch (error) {
    return ResponseErr("gagal mendapatkan data orders", error);
  }
}

export async function DeleteOrderHandler(req: NextRequest, id: string) {
  try {
    await db.transaction(async (tx) => {
      const [order] = await tx
        .select()
        .from(orderTable)
        .where(eq(orderTable.id, Number(id)))
        .innerJoin(customerTable, eq(customerTable.id, orderTable.customer_id));

      if (!order) {
        throw new Error("order tidak ditemukan");
      }

      if (order.orders.status == ACCEPTED_STATUS_ORDER[1]) {
        throw new Error("order yang sudah diselesaikan tidak bisa dihapus");
      }

      await tx.delete(orderTable).where(eq(orderTable.id, Number(id)));

      if (order.customers.type == "santri") {
        const charges = await tx
          .select()
          .from(chargeSantriTable)
          .where(
            and(
              eq(chargeSantriTable.customer_id, order.customers.id),
              sql`MONTH(${chargeSantriTable.created_at}) = ${
                order.orders.created_at?.getMonth()! + 1
              }`,
              sql`YEAR(${
                chargeSantriTable.created_at
              }) = ${order.orders.created_at?.getFullYear()}`
            )
          );

        if (charges.length === 0) {
          return;
        }

        if (charges[0].payed) {
          return;
        }

        const sum_qtys = await tx
          .select({
            sum_qty: sql<number>`COALESCE(SUM(${orderItemTable.quantity}), 0)`,
          })
          .from(orderItemTable)
          .innerJoin(orderTable, eq(orderTable.id, orderItemTable.order_id))
          .innerJoin(
            productTable,
            eq(orderItemTable.product_id, productTable.id)
          )
          .where(
            and(
              eq(orderTable.customer_id, order.customers.id),
              eq(productTable.unit, ACCEPTED_UNIT[0]),
              sql`MONTH(${orderTable.created_at}) = ${
                order.orders.created_at?.getMonth()! + 1
              }`,
              sql`YEAR(${
                orderTable.created_at
              }) = ${order.orders.created_at?.getFullYear()}`
            )
          );

        const totalKg = sum_qtys.length > 0 ? Number(sum_qtys[0].sum_qty) : 0;

        if (totalKg > SANTRI_LIMIT_KG_ORDER) {
          const actualCharge = totalKg - SANTRI_LIMIT_KG_ORDER;

          await tx
            .update(chargeSantriTable)
            .set({
              quantity: actualCharge.toString(),
              total_price: actualCharge * SANTRI_CHARGE_PRICE,
            })
            .where(eq(chargeSantriTable.id, charges[0].id));
        } else {
          await tx
            .delete(chargeSantriTable)
            .where(eq(chargeSantriTable.id, charges[0].id));
        }
      }
    });

    return ResponseOk(null, "sukses menghapus orderan");
  } catch (error) {
    return ResponseErr("gagal menghapus order", error);
  }
}
export async function UpdateStatusOrderHandler(req: NextRequest, id: string) {
  try {
    await db
      .update(orderTable)
      .set({
        status: ACCEPTED_STATUS_ORDER[1],
      })
      .where(eq(orderTable.id, Number(id)));

    return ResponseOk(null, "sukses konfirmasi status orderan");
  } catch (error) {
    return ResponseErr("gagal konfirmasi status order", error);
  }
}
