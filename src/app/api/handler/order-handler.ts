import {
  AddOrderSchema,
  EditOrderSchema,
  EditStatusOrderSchema,
  ListOrders,
  OrderItem,
} from "@/app/dto/order-dto";
import db from "@/db";
import {
  customersTable,
  orderItemTable,
  orderTable,
  productsTable,
} from "@/db/schema";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { eq, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";

const acceptedStatus: string[] = ["proses", "batal", "beres"];

export async function CreateOrderHandler(req: NextRequest) {
  try {
    const json = await req.json();
    const body = AddOrderSchema.parse(json);

    await db.transaction(async (tx) => {
      const [customer] = await tx
        .select()
        .from(customersTable)
        .where(eq(customersTable.id, Number(body.customer_id)))
        .limit(1);

      if (!customer) {
        throw new Error("pelanggan tidak diketahui");
      }

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
          status: acceptedStatus[0],
        })
        .execute();

      const orderId = order[0].insertId;

      const orderItems = body.items.map((item) => {
        const product = productMap.get(Number(item.product_id))!;

        return {
          order_id: orderId,
          price: product.price,
          product_id: Number(item.product_id),
          quantity: item.quantity.toString(),
          total_price: product.price * item.quantity,
        };
      });

      await tx.insert(orderItemTable).values(orderItems).execute();
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
      })
      .from(orderTable)
      .innerJoin(orderItemTable, eq(orderTable.id, orderItemTable.order_id))
      .innerJoin(customersTable, eq(orderTable.customer_id, customersTable.id))
      .innerJoin(
        productsTable,
        eq(orderItemTable.product_id, productsTable.id)
      );

    const ordersMap = new Map<number, ListOrders>();

    orders.forEach((row) => {
      if (!ordersMap.has(row.orderId)) {
        ordersMap.set(row.orderId, {
          id: row.orderId,
          customer_id: row.orderCustomerId,
          name: row.customerName,
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

    const result: ListOrders[] = Array.from(ordersMap.values());

    return ResponseOk(result, "sukses mendapatkan data orders");
  } catch (error) {
    return ResponseErr("gagal mendapatkan data orders", error);
  }
}

export async function UpdateOrderHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditOrderSchema.parse(json);

    await db.transaction(async (tx) => {
      await tx
        .update(orderTable)
        .set({
          customer_id: Number(body.customer_id),
          status: body.status,
        })
        .where(eq(orderTable.id, Number(id)));

      await tx
        .delete(orderItemTable)
        .where(eq(orderItemTable.order_id, Number(id)));

      const productIds = body.items.map((item) => Number(item.product_id));

      const products = await tx
        .select()
        .from(productsTable)
        .where(inArray(productsTable.id, productIds));

      if (products.length !== productIds.length) {
        throw new Error("ada produk yang tidak valid");
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      const orderItems = body.items.map((item) => {
        const product = productMap.get(Number(item.product_id))!;

        return {
          order_id: Number(id),
          price: product.price,
          product_id: Number(item.product_id),
          quantity: item.quantity.toString(),
          total_price: product.price * item.quantity,
        };
      });

      await tx.insert(orderItemTable).values(orderItems).execute();
    });

    return ResponseOk(null, "sukses mengedit order");
  } catch (error) {
    return ResponseErr("gagal mengedit order", error);
  }
}

export async function UpdateStatusOrderHandler(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = EditStatusOrderSchema.parse(json);

    if (
      !acceptedStatus.includes(body.status) ||
      body.status == acceptedStatus[0]
    ) {
      throw new Error("status tidak diketahui");
    }

    await db
      .update(orderTable)
      .set({
        status: body.status,
      })
      .where(eq(orderTable.id, Number(id)));

    return ResponseOk(null, "sukses konfirmasi orderan");
  } catch (error) {
    return ResponseErr("gagal menubah status order", error);
  }
}
