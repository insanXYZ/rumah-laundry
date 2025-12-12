import { acceptedTypeMonthlyMoney } from "@/app/dto/monthly-money-dto";
import {
  acceptedStatusOrder,
  AddOrderSchema,
  ListOrder,
} from "@/app/dto/order-dto";
import db from "@/db";
import {
  chargeSantriTable,
  customersTable,
  orderItemTable,
  orderTable,
  productsTable,
  santriMonthlyMoneyTable,
} from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { and, eq, inArray, sql, sum } from "drizzle-orm";
import { NextRequest } from "next/server";
import { acceptedUnit } from "./product-handler";

const limitKgOrder = 25; // in kg
const chargePrice = 6000; // per kg

export async function CreateOrderHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddOrderSchema.parse(json);

    await db.transaction(async (tx) => {
      const [customer] = await tx
        .select({
          id: customersTable.id,
          type_monthly_money: santriMonthlyMoneyTable.type,
        })
        .from(customersTable)
        .where(eq(customersTable.id, Number(body.customer_id)))
        .leftJoin(
          santriMonthlyMoneyTable,
          and(
            eq(santriMonthlyMoneyTable.customer_id, customersTable.id),
            sql`MONTH(${santriMonthlyMoneyTable.created_at}) = MONTH(NOW())`,
            sql`YEAR(${santriMonthlyMoneyTable.created_at}) = YEAR(NOW())`
          )
        )
        .limit(1);

      if (!customer) {
        throw new Error("pelanggan tidak diketahui");
      }

      const isSantriMonthly: boolean = acceptedTypeMonthlyMoney.includes(
        customer.type_monthly_money!
      );

      let sumQty: number = 0;

      const productIds = body.items.map((item) => Number(item.product_id));

      const products = await tx
        .select()
        .from(productsTable)
        .where(inArray(productsTable.id, productIds));

      if (products.length !== productIds.length) {
        throw new Error("ada produk yang tidak valid");
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      const order = await tx
        .insert(orderTable)
        .values({
          customer_id: Number(body.customer_id),
          status: acceptedStatusOrder[0],
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

        if (product.unit == acceptedUnit[0]) {
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
            productsTable,
            eq(orderItemTable.product_id, productsTable.id)
          )
          .where(
            and(
              eq(orderTable.customer_id, customer.id),
              eq(productsTable.unit, acceptedUnit[0]),
              sql<boolean>`MONTH(${orderItemTable.created_at}) = MONTH(NOW())`,
              sql<boolean>`YEAR(${orderItemTable.created_at}) = YEAR(NOW())`
            )
          )
          .groupBy(orderTable.customer_id);

        if (qtyOrderItem.length != 0) {
          sumQty += Number(qtyOrderItem[0].qty_total);
        }
        let chargeQty: number = 0;

        if (sumQty > limitKgOrder) {
          chargeQty = sumQty - limitKgOrder;
        }

        if (chargeQty != 0) {
          await db
            .delete(chargeSantriTable)
            .where(
              and(
                eq(chargeSantriTable.customer_id, customer.id),
                sql`MONTH(${chargeSantriTable.created_at}) = MONTH(NOW())`,
                sql`YEAR(${chargeSantriTable.created_at}) = YEAR(NOW())`
              )
            );

          await db.insert(chargeSantriTable).values({
            quantity: chargeQty.toString(),
            payed: false,
            amount: chargeQty * chargePrice,
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

export async function ListOrdersHandler() {
  try {
    const orders = await db
      .select({
        orderId: orderTable.id,
        orderCustomerId: orderTable.customer_id,
        orderStatus: orderTable.status,
        customerName: customersTable.name,
        itemId: orderItemTable.id,
        itemOrderId: orderItemTable.order_id,
        itemProductId: orderItemTable.product_id,
        itemQuantity: orderItemTable.quantity,
        itemPrice: orderItemTable.price,
        itemTotalPrice: orderItemTable.total_price,
        productName: productsTable.name,
        created_at: orderTable.created_at,
      })
      .from(orderTable)
      .innerJoin(orderItemTable, eq(orderTable.id, orderItemTable.order_id))
      .innerJoin(customersTable, eq(orderTable.customer_id, customersTable.id))
      .innerJoin(
        productsTable,
        eq(orderItemTable.product_id, productsTable.id)
      );

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
        price: row.itemPrice!,
        total_price: row.itemTotalPrice!,
      });
    });

    const result: ListOrder[] = Array.from(ordersMap.values());

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
        .innerJoin(
          customersTable,
          eq(customersTable.id, orderTable.customer_id)
        );

      if (!order) {
        throw new Error("order tidak ditemukan");
      }

      if (order.orders.status == acceptedStatusOrder[1]) {
        throw new Error("order yang sudah diselesaikan tidak bisa dihapus");
      }

      await tx.delete(orderTable).where(eq(orderTable.id, Number(id)));

      if (order.customers.type == "santri") {
        console.log("tanggal order", order.orders.created_at);
        console.log("bulan order", order.orders.created_at?.getMonth());
        console.log("tahun order", order.orders.created_at?.getFullYear());

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

        if (charges.length != 0) {
          if (charges[0].payed) {
            return;
          }
        }

        const [sum_qty] = await tx
          .select({
            sum_qty: sql<number>`sum(${orderItemTable.quantity})`,
          })
          .from(orderItemTable)
          .innerJoin(orderTable, eq(orderTable.id, orderItemTable.order_id))
          .innerJoin(
            productsTable,
            eq(orderItemTable.product_id, productsTable.id)
          )
          .where(
            and(
              eq(orderTable.customer_id, order.customers.id),
              eq(productsTable.unit, acceptedUnit[0])
            )
          )
          .groupBy(orderTable.customer_id);

        if (sum_qty.sum_qty > limitKgOrder) {
          const actualCharge = sum_qty.sum_qty - limitKgOrder;

          await tx
            .update(chargeSantriTable)
            .set({
              quantity: actualCharge.toString(),
              amount: actualCharge * chargePrice,
            })
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
        status: acceptedStatusOrder[1],
      })
      .where(eq(orderTable.id, Number(id)));

    return ResponseOk(null, "sukses konfirmasi status orderan");
  } catch (error) {
    return ResponseErr("gagal konfirmasi status order", error);
  }
}
